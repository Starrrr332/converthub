import type { ValidationResult, ImageFormat } from '../types';
import {
  FREE_FORMATS,
  FREE_MAX_SIZE,
  PREMIUM_FORMATS,
  PREMIUM_MAX_SIZE,
} from '../types';

export function validateImageFile(file: File, isPremium: boolean = false): ValidationResult {
  const maxSize = isPremium ? PREMIUM_MAX_SIZE : FREE_MAX_SIZE;
  const allowedFormats = isPremium ? PREMIUM_FORMATS : FREE_FORMATS;

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File exceeds ${isPremium ? '100MB' : '10MB'} limit. Upgrade to Premium for larger files.`,
      code: 'FILE_TOO_LARGE',
    };
  }

  if (!allowedFormats.includes(file.type as ImageFormat)) {
    return {
      valid: false,
      error: isPremium
        ? 'Unsupported file format'
        : 'Free plan: PNG, JPEG, WebP, BMP, GIF only. Upgrade to Premium for SVG, ICO, AVIF, HEIC.',
      code: 'UNSUPPORTED_FORMAT',
    };
  }

  return { valid: true };
}

export function createDownloadUrl(blob: Blob): string {
  const url = URL.createObjectURL(blob);
  return url;
}

export function triggerDownload(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function cleanupUrl(url: string): void {
  URL.revokeObjectURL(url);
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function createCanvasFromImage(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  ctx.drawImage(img, 0, 0);
  return canvas;
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      format,
      quality ? quality / 100 : undefined,
    );
  });
}

export function generateFilename(originalName: string, newFormat: ImageFormat): string {
  const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
  const extensions: Record<ImageFormat, string> = {
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'image/webp': '.webp',
    'image/bmp': '.bmp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/x-icon': '.ico',
    'image/avif': '.avif',
    'image/heic': '.heic',
  };

  return `${baseName}${extensions[newFormat]}`;
}
