import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SummaryModel, SummarySchema } from './orm-models/summary.orm-model';
import { BullModule } from '@nestjs/bullmq';
import {
  FILES_TO_SUMMARIZE_QUEUE,
  PAGE_TO_SUMMARIZE_QUEUE,
  SUMMARY_FINISH_QUEUE,
} from './constants/queue.constants';
import {
  SummaryPageModel,
  SummaryPageSchema,
} from './orm-models/summary-page.orm-model';
import { SummarizeFileProcessor } from './processors/file-summarize.processor';
import { SummarizePageProcessor } from './processors/page-summarize.processor';
import { AiSummaryService } from 'src/common/ai-summarize/ai-summary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SummaryModel.name, schema: SummarySchema },
      { name: SummaryPageModel.name, schema: SummaryPageSchema },
    ]),
    BullModule.registerQueue({
      name: PAGE_TO_SUMMARIZE_QUEUE,
    }),
    BullModule.registerQueue({
      name: FILES_TO_SUMMARIZE_QUEUE,
    }),
    BullModule.registerQueue({
      name: SUMMARY_FINISH_QUEUE,
    }),
  ],
  providers: [SummarizePageProcessor, SummarizeFileProcessor, AiSummaryService],
})
export class SummaryModule {}
