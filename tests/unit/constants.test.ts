import { describe, it, expect } from 'vitest';
import {
  getFileExtension,
  getMimeType,
  isFormatSupported,
  getOutputFormats,
  getMaxFileSize,
  formatFileSize,
  getFileExtensionFromName,
  getMimeTypeFromFilename,
  FORMAT_NAMES,
} from '../../src/utils/constants';

describe('getFileExtension', () => {
  it('returns correct extension for each format', () => {
    expect(getFileExtension('image/png')).toBe('.png');
    expect(getFileExtension('image/jpeg')).toBe('.jpg');
    expect(getFileExtension('image/webp')).toBe('.webp');
    expect(getFileExtension('image/bmp')).toBe('.bmp');
    expect(getFileExtension('image/gif')).toBe('.gif');
    expect(getFileExtension('image/svg+xml')).toBe('.svg');
    expect(getFileExtension('image/x-icon')).toBe('.ico');
    expect(getFileExtension('image/avif')).toBe('.avif');
    expect(getFileExtension('image/heic')).toBe('.heic');
  });
});

describe('getMimeType', () => {
  it('returns correct MIME type for each extension', () => {
    expect(getMimeType('.png')).toBe('image/png');
    expect(getMimeType('.jpg')).toBe('image/jpeg');
    expect(getMimeType('.jpeg')).toBe('image/jpeg');
    expect(getMimeType('.webp')).toBe('image/webp');
  });
});

describe('isFormatSupported', () => {
  it('returns true for supported formats', () => {
    expect(isFormatSupported('image/png')).toBe(true);
    expect(isFormatSupported('image/jpeg')).toBe(true);
    expect(isFormatSupported('image/avif')).toBe(true);
  });

  it('returns false for unsupported formats', () => {
    expect(isFormatSupported('application/pdf')).toBe(false);
    expect(isFormatSupported('text/plain')).toBe(false);
  });
});

describe('getOutputFormats', () => {
  it('returns all formats except the input format', () => {
    const outputs = getOutputFormats('image/png');
    expect(outputs).not.toContain('image/png');
    expect(outputs.length).toBeGreaterThan(0);
  });
});

describe('getMaxFileSize', () => {
  it('returns 100MB', () => {
    expect(getMaxFileSize()).toBe(100 * 1024 * 1024);
  });
});

describe('formatFileSize', () => {
  it('formats 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('formats bytes', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1 MB');
  });

  it('formats gigabytes', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
  });

  it('formats fractional values', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
  });
});

describe('getFileExtensionFromName', () => {
  it('extracts extension from filename', () => {
    expect(getFileExtensionFromName('photo.jpg')).toBe('.jpg');
    expect(getFileExtensionFromName('image.PNG')).toBe('.png');
  });
});

describe('getMimeTypeFromFilename', () => {
  it('returns MIME type for known extensions', () => {
    expect(getMimeTypeFromFilename('photo.jpg')).toBe('image/jpeg');
    expect(getMimeTypeFromFilename('icon.png')).toBe('image/png');
  });

  it('returns null for unknown extensions', () => {
    expect(getMimeTypeFromFilename('doc.pdf')).toBeNull();
  });
});

describe('FORMAT_NAMES', () => {
  it('has names for all formats', () => {
    const formats = [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/bmp',
      'image/gif',
      'image/svg+xml',
      'image/x-icon',
      'image/avif',
      'image/heic',
    ] as const;
    for (const fmt of formats) {
      expect(FORMAT_NAMES[fmt]).toBeTruthy();
    }
  });
});
