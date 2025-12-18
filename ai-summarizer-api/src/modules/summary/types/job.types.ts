export type ParseFileJobData = {
  summaryId: string;
  fileName: string;
};

export type SummarizePageTextJobData = {
  summaryId: string;
  pageNumber: number;
  fileName: string;
};

export type SummarizeFileJobData = {
  summaryId: string;
  fileName: string;
};

export type FinishSummaryJobData = {
  summaryId: string;
  fileName: string;
};
