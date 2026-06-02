import { useCallback } from 'react';
import { useConversionStore } from '../store/conversionStore';
import type { ImageFormat } from '../types';
import type { ConvertOptions } from '../types';
import { validateImageFile } from '../utils/fileHelpers';
import { isFormatSupported, getMaxFileSize } from '../utils/constants';

export function useImageConverter() {
  const store = useConversionStore();

  const addFiles = useCallback(
    (files: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const validation = validateImageFile(file);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      }

      if (errors.length > 0) {
        store.addFiles([]);
        console.error('Validation errors:', errors);
      } else {
        store.addFiles(validFiles);
      }
    },
    [store],
  );

  const convert = useCallback(async () => {
    await store.convert();
  }, [store]);

  const convertAll = useCallback(async () => {
    await store.convertAll();
  }, [store]);

  const setFormat = useCallback(
    (format: ImageFormat) => {
      if (isFormatSupported(format)) {
        store.setOptions({ format });
      }
    },
    [store],
  );

  const setQuality = useCallback(
    (quality: number) => {
      store.setOptions({ quality });
    },
    [store],
  );

  const setResize = useCallback(
    (width?: number, height?: number) => {
      store.setOptions({ width, height } as Partial<ConvertOptions>);
    },
    [store],
  );

  const setCrop = useCallback(
    (crop?: ConvertOptions['crop']) => {
      store.setOptions({ crop });
    },
    [store],
  );

  const setRotate = useCallback(
    (rotate?: number) => {
      store.setOptions({ rotate });
    },
    [store],
  );

  return {
    selectedFiles: store.selectedFiles,
    convertedFiles: store.convertedFiles,
    options: store.options,
    isConverting: store.isConverting,
    progress: store.progress,
    error: store.error,

    isPremium: true,
    remainingConversions: Infinity,
    canConvert: true,
    maxSize: getMaxFileSize(),

    addFiles,
    removeFile: store.removeFile,
    clearFiles: store.clearFiles,
    convert,
    convertAll,
    clearConverted: store.clearConverted,
    reset: store.reset,

    setFormat,
    setQuality,
    setResize,
    setCrop,
    setRotate,
  };
}
