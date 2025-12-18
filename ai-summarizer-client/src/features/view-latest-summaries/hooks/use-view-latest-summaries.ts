import { GET_LATEST_SUMMARIES_QUERY_KEY, SummaryApi } from "@/src/entities";
import { useQuery } from "@tanstack/react-query";

export const useViewLatestSummaries = () => {
  const { data, isLoading } = useQuery({
    queryKey: [GET_LATEST_SUMMARIES_QUERY_KEY],
    queryFn: async () => {
      return SummaryApi.getLatest();
    },
    refetchInterval: 5000,
  });

  return { data, isLoading };
};
