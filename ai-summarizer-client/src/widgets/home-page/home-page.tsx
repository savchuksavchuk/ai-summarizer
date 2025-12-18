import { UploadFile, ViewLatestSummaries } from "@/src/features";

export const HomePage = () => {
  return (
    <div className="h-full flex">
      <div className="w-full h-full max-h-[400px] my-auto flex items-center justify-between gap-8">
        <ViewLatestSummaries />

        <UploadFile />
      </div>
    </div>
  );
};
