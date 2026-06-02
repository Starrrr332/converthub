import { useCallback } from 'react';
import { useConversionStore } from '../store/conversionStore';
import { usePremiumStore } from '../store/premiumStore';
import { useConversionLimit } from './useConversionLimit';
import type { ImageFormat } from '../types';
import type { ConvertOptions } from '../types';
import { validateImageFile } from '../utils/fileHelpers';
import { isFormatSupported, getMaxFileSize } from '../utils/constants';

export function useImageConverter() {
  const store = useConversionStore();
  const isPremium = usePremiumStore((s) => s.checkPremium());
  const remainingConversions = useConversionLimit((s) => s.getRemaining());
  const canConvert = useConversionLimit((s) => s.canConvert());
  const incrementUsage = useConversionLimit((s) => s.incrementUsage);

  const addFiles = useCallback(
    (files: File[]) => {
      const validFiles: File[] = [];
      const errors: string[] = [];

      for (const file of files) {
        const validation = validateImageFile(file, isPremium);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      }

      if (errors.length > 0) {
        console.error('Validation errors:', errors);
        // Only add valid files instead of clearing all
        if (validFiles.length > 0) {
          store.addFiles(validFiles);
        }
      } else {
        store.addFiles(validFiles);
      }
    },
    [store, isPremium],
  );

  const convert = useCallback(async () => {
    if (!canConvert) return;
    await store.convert();
    incrementUsage();
  }, [store, canConvert, incrementUsage]);

  const convertAll = useCallback(async () => {
    if (!canConvert) return;
    await store.convertAll();
    incrementUsage();
  }, [store, canConvert, incrementUsage]);

  const setFormat = useCallback(
    (format: ImageFormat) => {
      if (isFormatSupported(format, isPremium)) {
        store.setOptions({ format });
      }
    },
    [store, isPremium],
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

    isPremium,
    remainingConversions,
    canConvert,
    maxSize: getMaxFileSize(isPremium),

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
