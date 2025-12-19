import { Summary } from "@/src/entities";
import {
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
} from "@/src/shared";
import { Skeleton } from "@/src/shared/ui/skeleton";
import { Loader2 } from "lucide-react";
import { FC } from "react";

type Props = {
  summary: Summary;
};

export const SummaryCard: FC<Props> = ({ summary }) => {
  return (
    <Item variant="outline">
      <ItemContent>
        {summary.status === "pending" ? (
          <div className="flex flex-col gap-1">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4 mt-1" />
          </div>
        ) : (
          <ItemDescription>{summary.summaryText}</ItemDescription>
        )}
      </ItemContent>
      <ItemActions>
        {summary.status === "completed" ? (
          <Button variant="outline" size="sm">
            View
          </Button>
        ) : summary.status === "pending" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
      </ItemActions>
    </Item>
  );
};
