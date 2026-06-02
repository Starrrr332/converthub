// ==================== IMAGE TYPES ====================

// Image formats
export type ImageFormat =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'image/bmp'
  | 'image/gif'
  | 'image/svg+xml'
  | 'image/x-icon'
  | 'image/avif'
  | 'image/heic';

// File extensions
export type FileExtension =
  | '.png'
  | '.jpg'
  | '.jpeg'
  | '.webp'
  | '.bmp'
  | '.gif'
  | '.svg'
  | '.ico'
  | '.avif'
  | '.heic';

// Conversion options
export interface ConvertOptions {
  format: ImageFormat;
  quality?: number;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  rotate?: number;
  flip?: {
    horizontal?: boolean;
    vertical?: boolean;
  };
  crop?: CropRegion;
  dpi?: number;
  compress?: boolean;
}

// Crop region
export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Conversion result
export interface ConversionResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

// ==================== PDF TYPES ====================

export type PdfTool =
  | 'merge'
  | 'split'
  | 'compress'
  | 'images-to-pdf'
  | 'protect'
  | 'watermark'
  | 'rotate'
  | 'page-numbers'
  | 'unlock';

export interface PdfMergeOptions {
  files: File[];
}

export interface PdfSplitOptions {
  file: File;
  pageRanges?: Array<{ start: number; end: number }>;
  splitAll?: boolean;
}

export interface PdfCompressOptions {
  file: File;
  quality: 'low' | 'medium' | 'high';
}

export interface PdfFromImagesOptions {
  files: File[];
  pageSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margin?: number;
}

export interface PdfProtectOptions {
  file: File;
  password: string;
  permissions?: {
    printing?: boolean;
    copying?: boolean;
    editing?: boolean;
  };
}

export interface PdfWatermarkOptions {
  file: File;
  text?: string;
  image?: File;
  opacity?: number;
  rotation?: number;
  fontSize?: number;
  color?: string;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface PdfConversionResult {
  blob: Blob;
  url: string;
  filename: string;
  size: number;
}

// ==================== SPREADSHEET TYPES ====================

export type SpreadsheetTool = 'csv-to-xlsx' | 'xlsx-to-csv' | 'csv-to-json' | 'json-to-csv';

export type SpreadsheetFormat = 'csv' | 'xlsx' | 'json';

export interface SpreadsheetConvertOptions {
  file: File;
  sheetName?: string;
  delimiter?: string;
}

export interface SpreadsheetPreviewResult {
  headers: string[];
  rows: string[][];
  totalRows: number;
  sheetName: string;
}

export interface SpreadsheetConversionResult {
  blob: Blob;
  url: string;
  filename: string;
  size: number;
  preview?: SpreadsheetPreviewResult;
}

// ==================== AUDIO TYPES ====================

export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'flac' | 'aac';

export interface AudioConvertOptions {
  format: AudioFormat;
  bitrate?: number;
  sampleRate?: number;
}

export interface AudioConversionResult {
  blob: Blob;
  url: string;
  filename: string;
  size: number;
  duration?: number;
}

// ==================== COMMON TYPES ====================

// Validation result
export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: string;
}

// User
export interface User {
  id: string;
  email: string;
  isPremium: boolean;
  subscriptionId?: string;
  expiresAt?: Date;
}

// Conversion limit
export interface ConversionLimit {
  date: string;
  count: number;
  limit: number;
}

// Premium plan
export type PremiumPlan = 'free' | 'premium';

// Subscription period
export type SubscriptionPeriod = 'monthly' | 'annual';

// ==================== CONSTANTS ====================

// Supported formats by plan
export const FREE_IMAGE_FORMATS: ImageFormat[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/bmp',
  'image/gif',
];

export const PREMIUM_IMAGE_FORMATS: ImageFormat[] = [
  ...FREE_IMAGE_FORMATS,
  'image/svg+xml',
  'image/x-icon',
  'image/avif',
  'image/heic',
];

// Aliases for backward compatibility
export const FREE_FORMATS = FREE_IMAGE_FORMATS;
export const PREMIUM_FORMATS = PREMIUM_IMAGE_FORMATS;

// File size limits
export const FREE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const PREMIUM_MAX_SIZE = 100 * 1024 * 1024; // 100MB

// Daily conversion limits
export const FREE_DAILY_LIMIT = 50;
export const PREMIUM_DAILY_LIMIT = Infinity;

// PDF limits
export const FREE_PDF_MERGE_LIMIT = 2;
export const PREMIUM_PDF_MERGE_LIMIT = 50;
export const FREE_PDF_FROM_IMAGES_LIMIT = 3;
export const PREMIUM_PDF_FROM_IMAGES_LIMIT = 50;

// Audio formats
export const AUDIO_FORMATS: AudioFormat[] = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
export const FREE_AUDIO_FORMATS: AudioFormat[] = ['mp3', 'wav'];
export const PREMIUM_AUDIO_FORMATS: AudioFormat[] = ['mp3', 'wav', 'ogg', 'flac', 'aac'];

// Supported MIME types
export const PDF_MIME_TYPES = ['application/pdf'];
export const IMAGE_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/bmp', 'image/gif'];
export const SPREADSHEET_MIME_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/json',
];
export const AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/flac',
  'audio/aac',
  'audio/mp4',
];
