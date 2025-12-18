import { Injectable } from '@nestjs/common';
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.js';
import { PDFPageProxy } from 'pdfjs-dist/types/web/interfaces';
import { createCanvas } from 'canvas';
import { createWorker } from 'tesseract.js';

@Injectable()
export class PdfService {
  private readonly textSizeThreshold = 500;

  async getPagesCount(data: Uint8Array) {
    const loadingTask = getDocument({ data });
    const pdfDocument = await loadingTask.promise;

    return { pdfDocument, pagesCount: pdfDocument.numPages };
  }

  async extractContentByPage(
    pdfDocument: PDFDocumentProxy,
    pageNum: number,
  ): Promise<string> {
    const page = await pdfDocument.getPage(pageNum);

    try {
      const text = await this.extractTextContentByPage(page);

      if (text.length >= this.textSizeThreshold) {
        return text;
      }

      const ocrText = await this.extractImagesContentByPage(page);

      return `${text}\n${ocrText}`.trim();
    } finally {
      page.cleanup();
    }
  }

  private async extractTextContentByPage(page: PDFPageProxy): Promise<string> {
    const extractedText = await page.getTextContent();

    return extractedText.items
      .map((item: any) => item.str)
      .filter(Boolean)
      .join(' ');
  }

  private async extractImagesContentByPage(
    page: PDFPageProxy,
  ): Promise<string> {
    const viewport = page.getViewport({ scale: 2 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const ctx = canvas.getContext('2d');

    await page.render({
      canvasContext: ctx as any,
      viewport,
    }).promise;

    const imageBuffer = canvas.toBuffer('image/png');

    const worker = await createWorker();
    const {
      data: { text },
    } = await worker.recognize(imageBuffer);

    await worker.terminate();

    return text;
  }
}
