import type { ImageFormat, FileExtension } from '../types';
import { FREE_FORMATS, FREE_MAX_SIZE, PREMIUM_FORMATS, PREMIUM_MAX_SIZE, FREE_DAILY_LIMIT, PREMIUM_DAILY_LIMIT } from '../types';

// Format to extension mapping
const FORMAT_TO_EXTENSION: Record<ImageFormat, FileExtension> = {
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

// Extension to format mapping
const EXTENSION_TO_FORMAT: Record<FileExtension, ImageFormat> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
  '.heic': 'image/heic',
};

// Format display names
export const FORMAT_NAMES: Record<ImageFormat, string> = {
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/webp': 'WebP',
  'image/bmp': 'BMP',
  'image/gif': 'GIF',
  'image/svg+xml': 'SVG',
  'image/x-icon': 'ICO',
  'image/avif': 'AVIF',
  'image/heic': 'HEIC',
};

// Format colors for UI
export const FORMAT_COLORS: Record<ImageFormat, string> = {
  'image/png': '#3B82F6',
  'image/jpeg': '#EF4444',
  'image/webp': '#10B981',
  'image/bmp': '#8B5CF6',
  'image/gif': '#F59E0B',
  'image/svg+xml': '#EC4899',
  'image/x-icon': '#6366F1',
  'image/avif': '#14B8A6',
  'image/heic': '#F97316',
};

// Premium format badges
export const PREMIUM_FORMAT_NAMES: Partial<Record<ImageFormat, string>> = {
  'image/svg+xml': 'Premium',
  'image/x-icon': 'Premium',
  'image/avif': 'Premium',
  'image/heic': 'Premium',
};

export function getFileExtension(mimeType: ImageFormat): FileExtension {
  return FORMAT_TO_EXTENSION[mimeType];
}

export function getMimeType(extension: FileExtension): ImageFormat {
  return EXTENSION_TO_FORMAT[extension];
}

export function isFormatSupported(format: string, isPremium: boolean = false): boolean {
  if (isPremium) {
    return PREMIUM_FORMATS.includes(format as ImageFormat);
  }
  return FREE_FORMATS.includes(format as ImageFormat);
}

export function getOutputFormats(inputFormat: string, isPremium: boolean = false): ImageFormat[] {
  const all = PREMIUM_FORMATS.filter((f: ImageFormat) => f !== inputFormat);
  if (isPremium) return all;
  return all.filter((f) => FREE_FORMATS.includes(f));
}

export function getMaxFileSize(isPremium: boolean = false): number {
  return isPremium ? PREMIUM_MAX_SIZE : FREE_MAX_SIZE;
}

export function getDailyLimit(isPremium: boolean = false): number {
  return isPremium ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;
}

export function getAcceptedFormats(isPremium: boolean = false): string[] {
  return isPremium ? PREMIUM_FORMATS : FREE_FORMATS;
}

export function isPremiumFormat(format: string): boolean {
  return !FREE_FORMATS.includes(format as ImageFormat);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtensionFromName(filename: string): FileExtension {
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
  return ext as FileExtension;
}

export function getMimeTypeFromFilename(filename: string): ImageFormat | null {
  const ext = getFileExtensionFromName(filename);
  return EXTENSION_TO_FORMAT[ext] || null;
}
