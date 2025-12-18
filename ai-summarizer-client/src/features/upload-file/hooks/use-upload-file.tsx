import { GET_LATEST_SUMMARIES_QUERY_KEY, SummaryApi } from "@/src/entities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: async (file: File) => {
      await SummaryApi.summarize(file);
    },
    onMutate: () => {
      toast.loading("Uploading file...");
    },
    onSuccess: () => {
      toast.dismiss();
      toast.success("File uploaded! Summary is being generated.");
      queryClient.invalidateQueries({
        queryKey: [GET_LATEST_SUMMARIES_QUERY_KEY],
      });
    },
    onError: () => {
      toast.dismiss();
      toast.error("Failed to upload file. Please try again.");
    },
  });

  const handleUpload = (file: File) => {
    mutate(file);
  };

  return { handleUpload, isPending };
};
