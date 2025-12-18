import { Injectable } from '@nestjs/common';
import { FileStorageService } from '../../common/file-storage/file-storage.service';
import { InjectModel } from '@nestjs/mongoose';
import { SummaryModel } from './orm-models/summary.orm-model';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { FILES_TO_PARSE_QUEUE } from './constants/queue.constants';
import { Queue } from 'bullmq';
import { JOB_TO_PARSE_FILE } from './constants/job.constants';
import { SummaryDto } from './dtos/summary.dto';
import { SummaryPreviewDto } from './dtos/summary-preview.dto';

@Injectable()
export class SummaryService {
  constructor(
    private readonly fileStorageService: FileStorageService,
    @InjectModel(SummaryModel.name)
    private readonly summaryModel: Model<SummaryModel>,
    @InjectQueue(FILES_TO_PARSE_QUEUE) private queue: Queue,
  ) {}

  async summarizeFile(file: Express.Multer.File) {
    const fileName = await this.fileStorageService.saveFile(file);
    const summaryRecord = await this.createInitialSummaryRecord();

    await this.enqueueFileForParsing(summaryRecord._id.toString(), fileName);
  }

  private readonly createInitialSummaryRecord =
    async (): Promise<SummaryModel> => {
      return this.summaryModel.create({
        status: 'pending',
      });
    };

  private readonly enqueueFileForParsing = async (
    summaryId: string,
    fileName: string,
  ): Promise<void> => {
    await this.queue.add(JOB_TO_PARSE_FILE, {
      summaryId,
      fileName,
    });
  };

  async getSummaryList(): Promise<SummaryPreviewDto[]> {
    const summaryRecords = await this.summaryModel
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return summaryRecords.map((summary) => new SummaryPreviewDto(summary));
  }

  async getSummaryById(summaryId: string): Promise<SummaryDto> {
    const summaryRecord = await this.summaryModel.findById(summaryId).lean();

    return new SummaryDto(summaryRecord);
  }
}
