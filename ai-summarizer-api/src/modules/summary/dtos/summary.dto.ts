import { Types } from 'mongoose';
import { ISummaryModel } from '../orm-models/summary.orm-model';

export class SummaryDto {
  _id: string;
  status: string;
  executionTimeInSeconds: number;
  summaryText: string;

  constructor(entity: ISummaryModel) {
    this._id =
      entity._id instanceof Types.ObjectId ? entity._id.toString() : entity._id;

    this.status = entity.status;
    this.executionTimeInSeconds = entity.executionTimeInSeconds;
    this.summaryText = entity.summaryText;
  }
}
