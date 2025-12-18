import { Module } from '@nestjs/common';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { FileStorageService } from '../../common/file-storage/file-storage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SummaryModel, SummarySchema } from './orm-models/summary.orm-model';
import { BullModule } from '@nestjs/bullmq';
import { ParseFileProcessor } from './processors/parse-file.processor';
import {
  FILES_TO_PARSE_QUEUE,
  FILES_TO_SUMMARIZE_QUEUE,
  TEXT_TO_SUMMARIZE_QUEUE,
} from './constants/queue.constants';
import { PdfService } from 'src/common/pdf/pdf.service';
import {
  SummaryPageModel,
  SummaryPageSchema,
} from './orm-models/summary-page.orm-model';
import { SummarizeTextProcessor } from './processors/page-summarize.processor';
import { AiSummaryService } from 'src/common/ai-summarize/ai-summary.service';
import { SummarizeFileProcessor } from './processors/file-summarize.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SummaryModel.name, schema: SummarySchema },
      { name: SummaryPageModel.name, schema: SummaryPageSchema },
    ]),
    BullModule.registerQueue({
      name: FILES_TO_PARSE_QUEUE,
    }),
    BullModule.registerQueue({
      name: TEXT_TO_SUMMARIZE_QUEUE,
    }),
    BullModule.registerQueue({
      name: FILES_TO_SUMMARIZE_QUEUE,
    }),
  ],
  controllers: [SummaryController],
  providers: [
    SummaryService,
    FileStorageService,
    ParseFileProcessor,
    AiSummaryService,
    SummarizeTextProcessor,
    SummarizeFileProcessor,
    PdfService,
  ],
})
export class SummaryModule {}
