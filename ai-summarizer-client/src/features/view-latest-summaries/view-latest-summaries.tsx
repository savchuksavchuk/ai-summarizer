"use client";

import { NoLatestSummaries } from "./components/no-latest-summaries";
import { SummaryCard } from "./components/summary-card";
import { SummarySkeleton } from "./components/summary-skeleton";
import { useViewLatestSummaries } from "./hooks/use-view-latest-summaries";

export const ViewLatestSummaries = () => {
  const { data, isLoading } = useViewLatestSummaries();

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <SummarySkeleton key={index} />
        ))
      ) : !!data?.length ? (
        data?.map((summary) => (
          <SummaryCard key={summary._id} summary={summary} />
        ))
      ) : (
        <NoLatestSummaries />
      )}
    </div>
  );
};
