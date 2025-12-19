import { Injectable } from '@nestjs/common';
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.js';
import { PDFPageProxy } from 'pdfjs-dist/types/web/interfaces';

@Injectable()
export class PdfService {
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
      return await this.extractTextContentByPage(page);
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
}
