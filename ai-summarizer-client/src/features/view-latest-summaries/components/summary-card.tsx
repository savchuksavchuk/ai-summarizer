"use client";

import { Summary } from "@/src/entities";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Skeleton,
} from "@/src/shared";

import { ChevronsUpDown, Loader2 } from "lucide-react";
import { FC } from "react";

type Props = {
  summary: Summary;
};

export const SummaryCard: FC<Props> = ({ summary }) => {
  return (
    <div className="border rounded-md w-full">
      <Collapsible defaultOpen={false} className="flex flex-col w-full">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          {summary.status === "completed" ? (
            <div className="font-semibold text-sm overflow-hidden line-clamp-2">
              {summary.summaryText.slice(0, 100)}
            </div>
          ) : (
            <Skeleton className="w-3/4 h-5" />
          )}

          {summary.status === "completed" && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronsUpDown className="transition-transform duration-200 data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
          )}

          {summary.status === "pending" && (
            <Button variant="ghost" size="icon" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          )}
        </div>

        <CollapsibleContent className="px-4 py-2 text-sm whitespace-pre-wrap">
          {summary.summaryText}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
