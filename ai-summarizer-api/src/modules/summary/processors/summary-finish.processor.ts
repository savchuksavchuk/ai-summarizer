import { Processor, WorkerHost } from '@nestjs/bullmq';
import { SUMMARY_FINISH_QUEUE } from '../constants/queue.constants';
import { FileStorageService } from 'src/common/file-storage/file-storage.service';
import { Job } from 'bullmq';
import { SummaryPageModel } from '../orm-models/summary-page.orm-model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FinishSummaryJobData } from '../types/job.types';
import { SummaryModel } from '../orm-models/summary.orm-model';

@Processor(SUMMARY_FINISH_QUEUE)
export class SummaryFinishProcessor extends WorkerHost {
  constructor(
    private readonly fileStorageService: FileStorageService,
    @InjectModel(SummaryModel.name)
    private readonly summaryModel: Model<SummaryModel>,
    @InjectModel(SummaryPageModel.name)
    private readonly summaryPageModel: Model<SummaryPageModel>,
  ) {
    super();
  }

  async process(job: Job<FinishSummaryJobData>): Promise<void> {
    const { summaryId, fileName } = job.data;

    const summaryRecord = await this.summaryModel.findById(
      new Types.ObjectId(summaryId),
    );

    await this.summaryModel.findByIdAndUpdate(
      new Types.ObjectId(summaryId),
      {
        status: 'completed',
        finishedAt: new Date(),
        executionTimeInSeconds:
          new Date().getTime() / 1000 -
          (summaryRecord?.createdAt?.getTime() || 0) / 1000,
      },
      { new: true },
    );

    //perform cleanup for file
    await this.fileStorageService.deleteFile(fileName);

    //perform cleanup for summary pages
    await this.summaryPageModel.deleteMany({
      summaryId: new Types.ObjectId(summaryId),
    });
  }
}
