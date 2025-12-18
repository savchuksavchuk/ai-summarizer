import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SummaryPageModel } from '../orm-models/summary-page.orm-model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SummarizeFileJobData } from '../types/job.types';
import { AiSummaryService } from 'src/common/ai-summarize/ai-summary.service';
import { SummaryModel } from '../orm-models/summary.orm-model';
import {
  FILES_TO_SUMMARIZE_QUEUE,
  SUMMARY_FINISH_QUEUE,
} from '../constants/queue.constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JOB_TO_FINISH_SUMMARY } from '../constants/job.constants';

@Processor(FILES_TO_SUMMARIZE_QUEUE)
export class SummarizeFileProcessor extends WorkerHost {
  private readonly logger: Logger = new Logger(SummarizeFileProcessor.name);

  constructor(
    private readonly aiSummaryService: AiSummaryService,
    @InjectModel(SummaryModel.name)
    private readonly summaryModel: Model<SummaryModel>,
    @InjectModel(SummaryPageModel.name)
    private readonly summaryPageModel: Model<SummaryPageModel>,
    @InjectQueue(SUMMARY_FINISH_QUEUE)
    private readonly queue: Queue,
  ) {
    super();
  }

  async process(job: Job<SummarizeFileJobData>): Promise<void> {
    const { summaryId, fileName } = job.data;

    const pages = await this.summaryPageModel
      .find({
        summaryId: new Types.ObjectId(summaryId),
      })
      .sort({ pageNumber: 1 });

    const fullText = pages.reduce(
      (acc, page) => acc + '\n' + page.summaryText,
      '',
    );

    const pagesCount = pages.length;

    const summary = await this.aiSummaryService.summarizeFileText(
      fullText,
      pagesCount,
    );

    const preview = summary.slice(0, 300);

    await this.summaryModel.updateOne(
      { _id: new Types.ObjectId(summaryId) },
      { summaryText: summary, previewText: preview },
    );

    this.logger.log(
      `File summary completed for summaryId: ${summaryId}, pages: ${pagesCount}`,
    );

    await this.queue.add(JOB_TO_FINISH_SUMMARY, { summaryId, fileName });
  }
}
