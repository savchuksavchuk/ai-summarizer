import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import {
  FILES_TO_SUMMARIZE_QUEUE,
  TEXT_TO_SUMMARIZE_QUEUE,
} from '../constants/queue.constants';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { SummaryPageModel } from '../orm-models/summary-page.orm-model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SummarizePageTextJobData } from '../types/job.types';
import { AiSummaryService } from 'src/common/ai-summarize/ai-summary.service';

@Processor(TEXT_TO_SUMMARIZE_QUEUE, { concurrency: 10 })
export class SummarizeTextProcessor extends WorkerHost {
  private readonly logger: Logger = new Logger(SummarizeTextProcessor.name);

  constructor(
    private readonly aiSummaryService: AiSummaryService,
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

    const summarizedText = await this.aiSummaryService.summarizePageText(
      pageRecordToSummarize.rawText,
    );

    await this.summaryPageModel.updateOne(
      { _id: new Types.ObjectId(pageRecordToSummarize._id) },
      { rawText: '', summaryText: summarizedText, status: 'completed' },
    );

    const isUnsummarizedPagesExist = await this.summaryPageModel.exists({
      summaryId: new Types.ObjectId(summaryId),
      status: 'pending',
    });

    if (!isUnsummarizedPagesExist) {
      await this.queue.add('file-summarize', { summaryId, fileName: fileName });
    }
  }
}
