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
  PAGE_TO_SUMMARIZE_QUEUE,
  SUMMARY_FINISH_QUEUE,
} from './constants/queue.constants';
import { PdfService } from 'src/common/pdf/pdf.service';
import {
  SummaryPageModel,
  SummaryPageSchema,
} from './orm-models/summary-page.orm-model';
import { SummaryFinishProcessor } from './processors/summary-finish.processor';

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
      name: PAGE_TO_SUMMARIZE_QUEUE,
    }),
    BullModule.registerQueue({
      name: SUMMARY_FINISH_QUEUE,
    }),
  ],
  controllers: [SummaryController],
  providers: [
    SummaryService,
    FileStorageService,
    ParseFileProcessor,
    SummaryFinishProcessor,
    PdfService,
  ],
})
export class SummaryModule {}
