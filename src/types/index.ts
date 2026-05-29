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
  | '.png' | '.jpg' | '.jpeg' | '.webp' 
  | '.bmp' | '.gif' | '.svg' | '.ico'
  | '.avif' | '.heic';

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
  format: ImageFormat;
}

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

// Supported formats by plan
export const FREE_FORMATS: ImageFormat[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/bmp',
  'image/gif'
];

export const PREMIUM_FORMATS: ImageFormat[] = [
  ...FREE_FORMATS,
  'image/svg+xml',
  'image/x-icon',
  'image/avif',
  'image/heic'
];

// File size limits
export const FREE_MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const PREMIUM_MAX_SIZE = 100 * 1024 * 1024; // 100MB

// Daily conversion limits
export const FREE_DAILY_LIMIT = 50; // 50 free conversions per day (unlimited for non-PDF)
export const PREMIUM_DAILY_LIMIT = Infinity;
