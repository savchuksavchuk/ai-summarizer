import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import {
  FILES_TO_PARSE_QUEUE,
  PAGE_TO_SUMMARIZE_QUEUE,
} from '../constants/queue.constants';
import { FileStorageService } from 'src/common/file-storage/file-storage.service';
import { PdfService } from 'src/common/pdf/pdf.service';
import { Job, Queue } from 'bullmq';
import {
  ISummaryPageModel,
  SummaryPageModel,
} from '../orm-models/summary-page.orm-model';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ParseFileJobData, SummarizePageTextJobData } from '../types/job.types';
import { SummaryModel } from '../orm-models/summary.orm-model';

@Processor(FILES_TO_PARSE_QUEUE)
export class ParseFileProcessor extends WorkerHost {
  private readonly BATCH_SIZE = 20;

  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly pdfService: PdfService,
    @InjectQueue(PAGE_TO_SUMMARIZE_QUEUE) private queue: Queue,
    @InjectModel(SummaryModel.name)
    private readonly summaryModel: Model<SummaryModel>,
    @InjectModel(SummaryPageModel.name)
    private readonly summaryPageModel: Model<SummaryPageModel>,
  ) {
    super();
  }

  async process(job: Job<ParseFileJobData>): Promise<void> {
    const { summaryId, fileName } = job.data;

    const fileBuffer = await this.fileStorageService.readFile(fileName);

    const { pdfDocument, pagesCount } = await this.pdfService.getPagesCount(
      new Uint8Array(fileBuffer),
    );

    await this.summaryModel.findOneAndUpdate(
      { _id: new Types.ObjectId(summaryId) },
      { pagesLeft: pagesCount },
    );

    await this.processPagesInBatches(
      summaryId,
      pdfDocument,
      pagesCount,
      fileName,
    );
  }

  private async processPagesInBatches(
    summaryId: string,
    pdfDocument: any,
    pagesCount: number,
    fileName: string,
  ) {
    let batchPages: Partial<ISummaryPageModel>[] = [];
    let batchJobs: { name: string; data: SummarizePageTextJobData }[] = [];

    for (let pageNum = 1; pageNum <= pagesCount; pageNum++) {
      const pageText = await this.pdfService.extractTextByPage(
        pdfDocument,
        pageNum,
      );

      batchPages.push({
        summaryId: new Types.ObjectId(summaryId),
        rawText: pageText,
        status: 'pending',
        pageNumber: pageNum,
      });

      batchJobs.push({
        name: PAGE_TO_SUMMARIZE_QUEUE,
        data: {
          summaryId,
          pageNumber: pageNum,
          fileName: fileName,
        },
      });

      if (batchPages.length >= this.BATCH_SIZE || pageNum === pagesCount) {
        await this.summaryPageModel.insertMany(batchPages);
        batchPages = [];

        await this.queue.addBulk(batchJobs);
        batchJobs = [];
      }
    }
  }
}
