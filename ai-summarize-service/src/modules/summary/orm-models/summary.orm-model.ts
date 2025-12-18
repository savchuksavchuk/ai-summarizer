import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface ISummaryModel {
  summaryText: string;
  pagesLeft: number;
  status: 'pending' | 'completed' | 'failed';
  finishedAt: Date;
  executionTimeInSeconds: number;
}

@Schema({
  collection: 'summaries',
  timestamps: true,
})
export class SummaryModel extends Document implements ISummaryModel {
  @Prop({
    type: String,
    required: false,
    default: '',
  })
  summaryText: string;

  @Prop({
    type: Number,
    required: true,
    default: 0,
  })
  pagesLeft: number;

  @Prop({
    type: String,
    default: false,
  })
  status: 'pending' | 'completed' | 'failed';

  @Prop({
    type: Date,
    required: false,
  })
  finishedAt: Date;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  executionTimeInSeconds: number;
}

export const SummarySchema = SchemaFactory.createForClass(SummaryModel);
