import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import {
  FILES_TO_SUMMARIZE_QUEUE,
  PAGE_TO_SUMMARIZE_QUEUE,
} from '../constants/queue.constants';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { SummaryPageModel } from '../orm-models/summary-page.orm-model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SummarizePageTextJobData } from '../types/job.types';
import { AiSummaryService } from 'src/common/ai-summarize/ai-summary.service';
import { JOB_TO_SUMMARIZE_FILE } from '../constants/job.constants';
import { SummaryModel } from '../orm-models/summary.orm-model';

@Processor(PAGE_TO_SUMMARIZE_QUEUE, { concurrency: 10 })
export class SummarizePageProcessor extends WorkerHost {
  private readonly logger: Logger = new Logger(SummarizePageProcessor.name);

  constructor(
    private readonly aiSummaryService: AiSummaryService,
    @InjectModel(SummaryModel.name)
    private readonly summaryModel: Model<SummaryModel>,
    @InjectModel(SummaryPageModel.name)
    private readonly summaryPageModel: Model<SummaryPageModel>,
    @InjectQueue(FILES_TO_SUMMARIZE_QUEUE) private queue: Queue,
  ) {
    super();
  }

  async process(job: Job<SummarizePageTextJobData>): Promise<void> {
    const { summaryId, pageNumber, fileName } = job.data;

    const pageRecordToSummarize = await this.summaryPageModel.findOne({
      summaryId: new Types.ObjectId(summaryId),
      pageNumber: pageNumber,
    });

    if (!pageRecordToSummarize) {
      this.logger.error(
        `No page found for summaryId: ${summaryId}, pageNumber: ${pageNumber}`,
      );
      return;
    }

    const summary = await this.aiSummaryService.summarizePageText(
      pageRecordToSummarize.rawText,
    );

    await this.summaryPageModel.updateOne(
      { _id: new Types.ObjectId(pageRecordToSummarize._id) },
      { rawText: '', summaryText: summary, status: 'completed' },
    );

    const updatedSummaryRecord = await this.summaryModel.findOneAndUpdate(
      { _id: new Types.ObjectId(summaryId) },
      { $inc: { pagesLeft: -1 } },
      { new: true },
    );

    const isAllPagesProcessed = updatedSummaryRecord.pagesLeft === 0;

    if (isAllPagesProcessed) {
      await this.queue.add(JOB_TO_SUMMARIZE_FILE, {
        summaryId,
        fileName: fileName,
      });
    }
  }
}
