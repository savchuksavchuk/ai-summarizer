export type SummaryStatus = "pending" | "completed" | "failed";

export type Summary = {
  _id: string;
  status: SummaryStatus;
  executionTimeInSeconds: number;
  summaryText: string;
  previewText: string;
};

export type SummaryPreviewItem = Pick<
  Summary,
  "_id" | "status" | "previewText"
>;
