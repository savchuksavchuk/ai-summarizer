import { Processor, WorkerHost } from '@nestjs/bullmq';
import { FILES_TO_SUMMARIZE_QUEUE } from '../constants/queue.constants';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SummaryPageModel } from '../orm-models/summary-page.orm-model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SummarizeFileJobData } from '../types/job.types';
import { AiSummaryService } from 'src/common/ai-summarize/ai-summary.service';
import { SummaryModel } from '../orm-models/summary.orm-model';
import { FileStorageService } from 'src/common/file-storage/file-storage.service';

@Processor(FILES_TO_SUMMARIZE_QUEUE, { concurrency: 10 })
export class SummarizeFileProcessor extends WorkerHost {
  private readonly logger: Logger = new Logger(SummarizeFileProcessor.name);

  constructor(
    private readonly aiSummaryService: AiSummaryService,
    private readonly fileStorageService: FileStorageService,
    @InjectModel(SummaryModel.name)
    private readonly summaryModel: Model<SummaryModel>,
    @InjectModel(SummaryPageModel.name)
    private readonly summaryPageModel: Model<SummaryPageModel>,
  ) {
    super();
  }

  async process(job: Job<SummarizeFileJobData>): Promise<void> {
    const { summaryId, fileName } = job.data;

    const pages = await this.summaryPageModel.find({
      summaryId: new Types.ObjectId(summaryId),
    });

    const fullText = pages.reduce(
      (acc, page) => acc + '\n' + page.summaryText,
      '',
    );

    const pagesCount = pages.length;

    const summary = await this.aiSummaryService.summarizeFileText(
      fullText,
      pagesCount,
    );

    await this.summaryModel.updateOne(
      { _id: new Types.ObjectId(summaryId) },
      { summaryText: summary },
    );

    this.logger.log(
      `File summary completed for summaryId: ${summaryId}, pages: ${pagesCount}`,
    );

    await this.summaryPageModel.deleteMany({
      summaryId: new Types.ObjectId(summaryId),
    });

    await this.fileStorageService.deleteFile(fileName);

    this.logger.log(
      `Cleaned up pages and file for summaryId: ${summaryId}, fileName: ${fileName}`,
    );
  }
}
