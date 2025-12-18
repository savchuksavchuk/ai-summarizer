import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared";
import { ArchiveX } from "lucide-react";

export const NoLatestSummaries = () => {
  return (
    <Empty className="w-full max-w-full">
      <EmptyHeader className="w-full max-w-full">
        <EmptyMedia variant="icon">
          <ArchiveX />
        </EmptyMedia>
        <EmptyTitle>There are no latest summaries yet</EmptyTitle>
        <EmptyDescription>
          Once you create summaries, they will appear here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
