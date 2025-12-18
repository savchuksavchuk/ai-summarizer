import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface ISummaryModel {
  summaryText: string;
  status: 'pending' | 'completed' | 'failed';
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
    type: String,
    default: false,
  })
  status: 'pending' | 'completed' | 'failed';
}

export const SummarySchema = SchemaFactory.createForClass(SummaryModel);
