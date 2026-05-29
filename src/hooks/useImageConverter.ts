import { useCallback } from 'react';
import { useConversionStore } from '../store/conversionStore';
import { useConversionLimit } from './useConversionLimit';
import { usePremiumStore } from '../store/premiumStore';
import type { ImageFormat } from '../types';
import type { ConvertOptions } from '../types';
import { validateImageFile } from '../utils/fileHelpers';
import { isFormatSupported, getMaxFileSize } from '../utils/constants';

export function useImageConverter() {
  const store = useConversionStore();
  const limit = useConversionLimit();
  const premium = usePremiumStore();
  
  const isPremium = premium.isPremium();
  
  const addFiles = useCallback((files: File[]) => {
    // Validate each file
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
      store.addFiles([]); // Don't add invalid files
      // TODO: Show errors to user
      console.error('Validation errors:', errors);
    } else {
      store.addFiles(validFiles);
    }
  }, [isPremium, store]);
  
  const convert = useCallback(async () => {
    // Check conversion limit
    if (!isPremium && !limit.canConvert()) {
      console.error('Daily conversion limit reached');
      return;
    }
    
    // Convert
    await store.convert();
    
    // Increment usage if successful
    if (!store.error) {
      limit.incrementUsage();
    }
  }, [isPremium, limit, store]);
  
  const convertAll = useCallback(async () => {
    // Check conversion limit
    if (!isPremium && !limit.canConvert()) {
      console.error('Daily conversion limit reached');
      return;
    }
    
    // Convert all
    await store.convertAll();
    
    // Increment usage for each file
    if (!store.error) {
      for (let i = 0; i < store.selectedFiles.length; i++) {
        limit.incrementUsage();
      }
    }
  }, [isPremium, limit, store]);
  
  const setFormat = useCallback((format: ImageFormat) => {
    if (isFormatSupported(format, isPremium)) {
      store.setOptions({ format });
    }
  }, [isPremium, store]);
  
  const setQuality = useCallback((quality: number) => {
    store.setOptions({ quality });
  }, [store]);
  
  const setResize = useCallback((width?: number, height?: number) => {
    store.setOptions({ width, height } as Partial<ConvertOptions>);
  }, [store]);
  
  const setCrop = useCallback((crop?: ConvertOptions['crop']) => {
    store.setOptions({ crop });
  }, [store]);
  
  const setRotate = useCallback((rotate?: number) => {
    store.setOptions({ rotate });
  }, [store]);
  
  return {
    // State
    selectedFiles: store.selectedFiles,
    convertedFiles: store.convertedFiles,
    options: store.options,
    isConverting: store.isConverting,
    progress: store.progress,
    error: store.error,
    
    // Computed
    isPremium,
    remainingConversions: limit.getRemaining(),
    canConvert: limit.canConvert(),
    maxSize: getMaxFileSize(isPremium),
    
    // Actions
    addFiles,
    removeFile: store.removeFile,
    clearFiles: store.clearFiles,
    convert,
    convertAll,
    clearConverted: store.clearConverted,
    reset: store.reset,
    
    // Options
    setFormat,
    setQuality,
    setResize,
    setCrop,
    setRotate
  };
}
