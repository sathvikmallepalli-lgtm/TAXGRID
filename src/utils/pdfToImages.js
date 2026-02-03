import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure pdf.js worker using Vite's ?url import for reliable local resolution
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

/**
 * Convert a PDF File to an array of image data URLs (one per page).
 * @param {File} file - PDF file object
 * @param {number} scale - Render scale (2.5 = ~180dpi for OCR)
 * @returns {Promise<Array<{dataUrl: string, pageNum: number}>>}
 */
export async function pdfToImages(file, scale = 2.5) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const results = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d');
    await page.render({ canvasContext: ctx, viewport }).promise;

    results.push({
      dataUrl: canvas.toDataURL('image/png'),
      pageNum: i,
    });

    page.cleanup();
  }

  return results;
}
