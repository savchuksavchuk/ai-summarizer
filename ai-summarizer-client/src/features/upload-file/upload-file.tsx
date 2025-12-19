"use client";

import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/shared";
import { CloudUploadIcon } from "lucide-react";
import { useUploadFile } from "./hooks/use-upload-file";
import { useRef } from "react";

export const UploadFile = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { handleUpload, isPending } = useUploadFile();

  return (
    <div className="w-full h-full border rounded-xl flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CloudUploadIcon />
          </EmptyMedia>
          <EmptyTitle>Upload the PDF</EmptyTitle>
          <EmptyDescription>
            Start by uploading a PDF file to summarize its content.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            disabled={isPending}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer"
          >
            Upload
          </Button>
        </EmptyContent>
      </Empty>
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          handleUpload(file);

          e.target.value = "";
        }}
      />
    </div>
  );
};
