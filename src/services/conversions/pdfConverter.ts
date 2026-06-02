import { PDFDocument, rgb, RotationTypes } from 'pdf-lib';
import type {
  PdfMergeOptions,
  PdfSplitOptions,
  PdfCompressOptions,
  PdfFromImagesOptions,
  PdfWatermarkOptions,
  PdfConversionResult,
} from '../../types';

// ==================== MERGE PDFs ====================

export async function mergePdfs(options: PdfMergeOptions): Promise<PdfConversionResult> {
  const mergedPdf = await PDFDocument.create();

  for (const file of options.files) {
    const pdfBytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

    copiedPages.forEach((page) => {
      mergedPdf.addPage(page);
    });
  }

  const mergedPdfBytes = await mergedPdf.save();
  const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, filename: 'merged.pdf', size: blob.size };
}

// ==================== SPLIT PDF ====================

export async function splitPdf(options: PdfSplitOptions): Promise<PdfConversionResult[]> {
  const pdfBytes = await options.file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const pageCount = pdf.getPageCount();
  const results: PdfConversionResult[] = [];

  if (options.splitAll) {
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(newPdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      results.push({ blob, url, filename: `page-${i + 1}.pdf`, size: blob.size });
    }
  } else if (options.pageRanges) {
    for (const range of options.pageRanges) {
      const newPdf = await PDFDocument.create();
      const indices: number[] = [];

      for (let i = range.start - 1; i < range.end && i < pageCount; i++) {
        indices.push(i);
      }

      const copiedPages = await newPdf.copyPages(pdf, indices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(newPdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      results.push({
        blob,
        url,
        filename: `pages-${range.start}-${range.end}.pdf`,
        size: blob.size,
      });
    }
  }

  return results;
}

// ==================== COMPRESS PDF ====================

export async function compressPdf(options: PdfCompressOptions): Promise<PdfConversionResult> {
  const pdfBytes = await options.file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);

  pdf.setTitle('');
  pdf.setAuthor('');
  pdf.setSubject('');
  pdf.setKeywords([]);
  pdf.setProducer('');
  pdf.setCreator('');

  const compressedBytes = await pdf.save({ useObjectStreams: true, addDefaultPage: false });
  const blob = new Blob([new Uint8Array(compressedBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, filename: `compressed-${options.file.name}`, size: blob.size };
}

// ==================== IMAGES TO PDF ====================

export async function imagesToPdf(options: PdfFromImagesOptions): Promise<PdfConversionResult> {
  const pdf = await PDFDocument.create();

  for (const file of options.files) {
    const imageBytes = await file.arrayBuffer();

    let image;
    if (file.type === 'image/png') {
      image = await pdf.embedPng(imageBytes);
    } else if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdf.embedJpg(imageBytes);
    } else {
      const img = new Image();
      const imgUrl = URL.createObjectURL(file);
      img.src = imgUrl;

      await new Promise<void>((resolve) => {
        img.onload = () => resolve();
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const jpegBytes = await new Promise<ArrayBuffer>((resolve) => {
        canvas.toBlob(
          (blob) => {
            blob!.arrayBuffer().then(resolve);
          },
          'image/jpeg',
          0.95,
        );
      });

      image = await pdf.embedJpg(jpegBytes);
      URL.revokeObjectURL(imgUrl);
    }

    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  const pdfBytes = await pdf.save();
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, filename: 'images.pdf', size: blob.size };
}

// ==================== WATERMARK PDF ====================

export async function watermarkPdf(options: PdfWatermarkOptions): Promise<PdfConversionResult> {
  const pdfBytes = await options.file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const pages = pdf.getPages();

  const {
    text = 'WATERMARK',
    opacity = 0.3,
    rotation = -45,
    fontSize = 60,
    color = 'gray',
    position = 'center',
  } = options;

  const font = await pdf.embedFont('Helvetica');

  const colorMap: Record<string, [number, number, number]> = {
    gray: [0.5, 0.5, 0.5],
    red: [1, 0, 0],
    blue: [0, 0, 1],
    green: [0, 1, 0],
    black: [0, 0, 0],
  };

  const [r, g, b] = colorMap[color] || colorMap['gray'];

  for (const page of pages) {
    const { width, height } = page.getSize();

    let x = width / 2;
    let y = height / 2;

    if (position === 'top-left') {
      x = 100;
      y = height - 100;
    }
    if (position === 'top-right') {
      x = width - 100;
      y = height - 100;
    }
    if (position === 'bottom-left') {
      x = 100;
      y = 100;
    }
    if (position === 'bottom-right') {
      x = width - 100;
      y = 100;
    }

    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(r, g, b),
      opacity,
      rotate: { type: RotationTypes.Degrees, angle: rotation },
    });
  }

  const watermarkedBytes = await pdf.save();
  const blob = new Blob([new Uint8Array(watermarkedBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, filename: `watermarked-${options.file.name}`, size: blob.size };
}

// ==================== VALIDATION ====================

export function validatePdfFile(file: File): boolean {
  return file.type === 'application/pdf';
}

export function validateImageFileForPdf(file: File): boolean {
  return ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
}

// ==================== ROTATE PDF ====================

export async function rotatePdf(options: {
  file: File;
  degrees: number;
}): Promise<PdfConversionResult> {
  const pdfBytes = await options.file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const pages = pdf.getPages();

  for (const page of pages) {
    const currentRotation = page.getRotation().angle;
    page.setRotation({ type: RotationTypes.Degrees, angle: currentRotation + options.degrees });
  }

  const rotatedBytes = await pdf.save();
  const blob = new Blob([new Uint8Array(rotatedBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, filename: `rotated-${options.file.name}`, size: blob.size };
}

// ==================== ADD PAGE NUMBERS ====================

export async function addPageNumbers(options: {
  file: File;
  position?: 'bottom-center' | 'bottom-right' | 'top-center';
}): Promise<PdfConversionResult> {
  const pdfBytes = await options.file.arrayBuffer();
  const pdf = await PDFDocument.load(pdfBytes);
  const pages = pdf.getPages();
  const font = await pdf.embedFont('Helvetica');
  const pageCount = pages.length;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const pageNum = `${i + 1} / ${pageCount}`;
    const textWidth = font.widthOfTextAtSize(pageNum, 10);

    let x = (width - textWidth) / 2;
    let y = 30;

    if (options.position === 'bottom-right') {
      x = width - textWidth - 40;
      y = 30;
    } else if (options.position === 'top-center') {
      x = (width - textWidth) / 2;
      y = height - 30;
    }

    page.drawText(pageNum, {
      x,
      y,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  const numberedBytes = await pdf.save();
  const blob = new Blob([new Uint8Array(numberedBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, filename: `numbered-${options.file.name}`, size: blob.size };
}

// ==================== UNLOCK PDF (remove password) ====================

export async function unlockPdf(options: {
  file: File;
  password: string;
}): Promise<PdfConversionResult> {
  const pdfBytes = await options.file.arrayBuffer();

  let pdf;
  try {
    pdf = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  } catch {
    throw new Error('No se pudo abrir el PDF. Asegúrate de que el archivo no esté dañado.');
  }

  const unlockedBytes = await pdf.save();
  const blob = new Blob([new Uint8Array(unlockedBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, filename: `unlocked-${options.file.name}`, size: blob.size };
}
