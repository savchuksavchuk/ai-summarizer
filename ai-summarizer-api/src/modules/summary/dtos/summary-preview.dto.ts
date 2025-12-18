import { ISummaryModel } from '../orm-models/summary.orm-model';
import { Types } from 'mongoose';

export class SummaryPreviewDto {
  _id: string;
  status: string;
  previewText: string;

  constructor(entity: ISummaryModel) {
    this._id =
      entity._id instanceof Types.ObjectId
        ? entity._id.toString()
        : (entity._id as string);

    this.status = entity.status;
    this.previewText = entity.previewText;
  }
}
