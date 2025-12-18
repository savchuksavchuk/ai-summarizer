import { Injectable } from '@nestjs/common';
import { getDocument, PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.js';

@Injectable()
export class PdfService {
  async getPagesCount(data: Uint8Array) {
    const loadingTask = getDocument({ data });

    const pdfDocument = await loadingTask.promise;

    return { pdfDocument, pagesCount: pdfDocument.numPages };
  }

  async extractTextByPage(
    pdfDocument: PDFDocumentProxy,
    pageNum: number,
  ): Promise<string> {
    const page = await pdfDocument.getPage(pageNum);

    const textContent = await page.getTextContent();

    const pageText = textContent.items.map((item: any) => item.str).join(' ');

    page.cleanup();

    return pageText;
  }
}
