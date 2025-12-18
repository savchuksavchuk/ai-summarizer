import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface ISummaryPageModel {
  summaryId: string | Types.ObjectId;
  rawText: string;
  summaryText: string;
  pageNumber: number;
  status: 'pending' | 'completed';
}

@Schema({
  collection: 'summary_pages',
  timestamps: true,
})
export class SummaryPageModel extends Document implements ISummaryPageModel {
  @Prop({ type: Types.ObjectId, required: true, ref: 'summaries' })
  summaryId: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
    default: '',
  })
  rawText: string;

  @Prop({
    type: String,
    required: false,
    default: '',
  })
  summaryText: string;

  @Prop({
    type: Number,
    required: true,
  })
  pageNumber: number;

  @Prop({
    type: String,
    default: false,
  })
  status: 'pending' | 'completed';
}

export const SummaryPageSchema = SchemaFactory.createForClass(SummaryPageModel);
