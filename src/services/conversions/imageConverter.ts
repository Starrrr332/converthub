import type { ImageFormat, ConvertOptions, ConversionResult, CropRegion } from '../../types';
import {
  readFileAsDataURL,
  loadImage,
  createCanvasFromImage,
  canvasToBlob,
} from '../../utils/fileHelpers';

let worker: Worker | null = null;
let workerReady = false;
let messageId = 0;
const pendingCallbacks = new Map<
  number,
  { resolve: (r: ConversionResult) => void; reject: (e: Error) => void }
>();

const supportsOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';

function getWorker(): Worker | null {
  if (!supportsOffscreenCanvas) return null;
  if (worker && workerReady) return worker;

  if (!worker) {
    worker = new Worker(new URL('../../workers/imageWorker.ts', import.meta.url), {
      type: 'module',
    });
    worker.onmessage = (e) => {
      const { id, success, blob, error } = e.data;
      const pending = pendingCallbacks.get(id);
      if (!pending) return;
      pendingCallbacks.delete(id);

      if (success) {
        const url = URL.createObjectURL(blob);
        pending.resolve({
          blob,
          url,
          width: 0,
          height: 0,
          size: blob.size,
          format: '',
        });
      } else {
        pending.reject(new Error(error));
      }
    };
    worker.onerror = (e) => {
      console.error('Image worker error:', e);
    };
    workerReady = true;
  }
  return worker;
}

function convertViaWorker(file: File, options: ConvertOptions): Promise<ConversionResult> {
  const w = getWorker();
  if (!w) return Promise.reject(new Error('Worker not available'));

  const id = ++messageId;
  return new Promise<ConversionResult>((resolve, reject) => {
    pendingCallbacks.set(id, { resolve, reject });
    w.postMessage({ type: 'processImage', id, file, options });
  });
}

export async function convertImage(file: File, options: ConvertOptions): Promise<ConversionResult> {
  if (supportsOffscreenCanvas && getWorker()) {
    try {
      return await convertViaWorker(file, options);
    } catch {
      // Fallback to main thread
    }
  }

  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);

  let canvas = createCanvasFromImage(img);

  if (options.width || options.height) {
    canvas = resizeCanvas(
      canvas,
      options.width || canvas.width,
      options.height || canvas.height,
      options.maintainAspectRatio ?? true,
    );
  }

  if (options.crop) {
    canvas = cropCanvas(canvas, options.crop);
  }

  if (options.rotate && options.rotate !== 0) {
    canvas = rotateCanvas(canvas, options.rotate);
  }

  if (options.flip) {
    canvas = flipCanvas(canvas, options.flip.horizontal, options.flip.vertical);
  }

  const blob = await canvasToBlob(canvas, options.format, options.quality);
  const url = URL.createObjectURL(blob);

  return {
    blob,
    url,
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
    format: options.format,
  };
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean,
): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas');
  const ctx = newCanvas.getContext('2d')!;

  let { width, height } = canvas;

  if (maintainAspectRatio) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  } else {
    width = maxWidth;
    height = maxHeight;
  }

  newCanvas.width = width;
  newCanvas.height = height;

  ctx.drawImage(canvas, 0, 0, width, height);

  return newCanvas;
}

function cropCanvas(canvas: HTMLCanvasElement, region: CropRegion): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas');
  const ctx = newCanvas.getContext('2d')!;

  newCanvas.width = region.width;
  newCanvas.height = region.height;

  ctx.drawImage(
    canvas,
    region.x,
    region.y,
    region.width,
    region.height,
    0,
    0,
    region.width,
    region.height,
  );

  return newCanvas;
}

function rotateCanvas(canvas: HTMLCanvasElement, degrees: number): HTMLCanvasElement {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const newWidth = Math.round(canvas.width * cos + canvas.height * sin);
  const newHeight = Math.round(canvas.width * sin + canvas.height * cos);

  const newCanvas = document.createElement('canvas');
  newCanvas.width = newWidth;
  newCanvas.height = newHeight;

  const ctx = newCanvas.getContext('2d')!;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return newCanvas;
}

function flipCanvas(
  canvas: HTMLCanvasElement,
  horizontal?: boolean,
  vertical?: boolean,
): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;

  const ctx = newCanvas.getContext('2d')!;

  ctx.translate(horizontal ? canvas.width : 0, vertical ? canvas.height : 0);
  ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
  ctx.drawImage(canvas, 0, 0);

  return newCanvas;
}

export async function resizeImage(
  file: File,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true,
): Promise<ConversionResult> {
  return convertImage(file, {
    format: file.type as ImageFormat,
    width,
    height,
    maintainAspectRatio,
  });
}

export async function compressImage(file: File, quality: number): Promise<ConversionResult> {
  const format: ImageFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';

  return convertImage(file, {
    format,
    quality,
  });
}

export async function cropImage(file: File, region: CropRegion): Promise<ConversionResult> {
  return convertImage(file, {
    format: file.type as ImageFormat,
    crop: region,
  });
}

export async function rotateImage(file: File, degrees: number): Promise<ConversionResult> {
  return convertImage(file, {
    format: file.type as ImageFormat,
    rotate: degrees,
  });
}

export async function changeDpi(file: File, dpi: number): Promise<ConversionResult> {
  // DPI change works by resizing: new pixels = original pixels * (targetDpi / sourceDpi)
  // For a standard screen (96 DPI), we calculate the scale factor
  const dataUrl = await readFileAsDataURL(file);
  const img = await loadImage(dataUrl);
  const sourceDpi = 96; // Standard screen DPI
  const scale = dpi / sourceDpi;

  const newWidth = Math.round(img.naturalWidth * scale);
  const newHeight = Math.round(img.naturalHeight * scale);

  return convertImage(file, {
    format: file.type as ImageFormat,
    width: newWidth,
    height: newHeight,
    maintainAspectRatio: true,
  });
}

export async function convertBatch(
  files: File[],
  options: ConvertOptions,
  onProgress?: (current: number, total: number) => void,
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await convertImage(files[i], options);
    results.push(result);
    onProgress?.(i + 1, files.length);
  }

  return results;
}
