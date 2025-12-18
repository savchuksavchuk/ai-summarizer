import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface ISummaryModel {
  summaryText: string;
  pagesLeft: number;
  status: 'pending' | 'completed' | 'failed';
  executionTimeInSeconds: number;

  finishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
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
    type: Number,
    required: false,
    default: 0,
  })
  executionTimeInSeconds: number;

  @Prop({
    type: Date,
    required: false,
  })
  finishedAt: Date;

  @Prop({
    type: Date,
    required: false,
  })
  createdAt: Date;

  @Prop({
    type: Date,
    required: false,
  })
  updatedAt: Date;
}

export const SummarySchema = SchemaFactory.createForClass(SummaryModel);
