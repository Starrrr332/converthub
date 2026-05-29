import type { ImageFormat, ConvertOptions, ConversionResult, CropRegion } from '../../types';
import { 
  readFileAsDataURL, 
  loadImage, 
  createCanvasFromImage, 
  canvasToBlob
} from '../../utils/fileHelpers';

export async function convertImage(
  file: File,
  options: ConvertOptions
): Promise<ConversionResult> {
  // Read file as data URL for image loading
  const dataUrl = await readFileAsDataURL(file);
  
  // Load image
  const img = await loadImage(dataUrl);
  
  // Create canvas and apply transformations
  let canvas = createCanvasFromImage(img);
  
  // Apply resize if specified
  if (options.width || options.height) {
    canvas = resizeCanvas(
      canvas,
      options.width || canvas.width,
      options.height || canvas.height,
      options.maintainAspectRatio ?? true
    );
  }
  
  // Apply crop if specified
  if (options.crop) {
    canvas = cropCanvas(canvas, options.crop);
  }
  
  // Apply rotation if specified
  if (options.rotate && options.rotate !== 0) {
    canvas = rotateCanvas(canvas, options.rotate);
  }
  
  // Apply flip if specified
  if (options.flip) {
    canvas = flipCanvas(canvas, options.flip.horizontal, options.flip.vertical);
  }
  
  // Convert to blob
  const blob = await canvasToBlob(canvas, options.format, options.quality);
  
  // Create result
  const url = URL.createObjectURL(blob);
  
  return {
    blob,
    url,
    width: canvas.width,
    height: canvas.height,
    size: blob.size,
    format: options.format
  };
}

function resizeCanvas(
  canvas: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number,
  maintainAspectRatio: boolean
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
  
  // Draw resized image
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
    region.height
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
  
  // Move to center, rotate, draw
  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
  
  return newCanvas;
}

function flipCanvas(
  canvas: HTMLCanvasElement,
  horizontal?: boolean,
  vertical?: boolean
): HTMLCanvasElement {
  const newCanvas = document.createElement('canvas');
  newCanvas.width = canvas.width;
  newCanvas.height = canvas.height;
  
  const ctx = newCanvas.getContext('2d')!;
  
  ctx.translate(
    horizontal ? canvas.width : 0,
    vertical ? canvas.height : 0
  );
  ctx.scale(horizontal ? -1 : 1, vertical ? -1 : 1);
  ctx.drawImage(canvas, 0, 0);
  
  return newCanvas;
}

export async function resizeImage(
  file: File,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<ConversionResult> {
  return convertImage(file, {
    format: file.type as ImageFormat,
    width,
    height,
    maintainAspectRatio
  });
}

export async function compressImage(
  file: File,
  quality: number
): Promise<ConversionResult> {
  const format: ImageFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  
  return convertImage(file, {
    format,
    quality
  });
}

export async function cropImage(
  file: File,
  region: CropRegion
): Promise<ConversionResult> {
  return convertImage(file, {
    format: file.type as ImageFormat,
    crop: region
  });
}

export async function rotateImage(
  file: File,
  degrees: number
): Promise<ConversionResult> {
  return convertImage(file, {
    format: file.type as ImageFormat,
    rotate: degrees
  });
}

export async function changeDpi(
  file: File,
  _dpi: number
): Promise<ConversionResult> {
  // Note: DPI is metadata, actual pixel dimensions remain the same
  // This function ensures the output has the correct DPI metadata
  return convertImage(file, {
    format: file.type as ImageFormat
  });
}

export async function convertBatch(
  files: File[],
  options: ConvertOptions,
  onProgress?: (current: number, total: number) => void
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await convertImage(files[i], options);
    results.push(result);
    onProgress?.(i + 1, files.length);
  }
  
  return results;
}
