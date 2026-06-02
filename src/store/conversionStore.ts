import { create } from 'zustand';
import type { ConvertOptions, ConversionResult } from '../types';
import { convertImage, convertBatch } from '../services/conversions/imageConverter';

interface ConversionState {
  // Files
  selectedFiles: File[];
  convertedFiles: ConversionResult[];

  // Options
  options: ConvertOptions;

  // Status
  isConverting: boolean;
  progress: number;
  error: string | null;

  // Actions
  addFiles: (files: File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  setOptions: (options: Partial<ConvertOptions>) => void;
  convert: () => Promise<void>;
  convertAll: () => Promise<void>;
  clearConverted: () => void;
  reset: () => void;
}

const defaultOptions: ConvertOptions = {
  format: 'image/webp',
  quality: 85,
  maintainAspectRatio: true,
};

export const useConversionStore = create<ConversionState>((set, get) => ({
  // Initial state
  selectedFiles: [],
  convertedFiles: [],
  options: defaultOptions,
  isConverting: false,
  progress: 0,
  error: null,

  // Actions
  addFiles: (files) => {
    set((state) => ({
      selectedFiles: [...state.selectedFiles, ...files],
      error: null,
    }));
  },

  removeFile: (index) => {
    set((state) => ({
      selectedFiles: state.selectedFiles.filter((_, i) => i !== index),
    }));
  },

  clearFiles: () => {
    // Cleanup URLs
    const { convertedFiles } = get();
    convertedFiles.forEach((f) => URL.revokeObjectURL(f.url));

    set({
      selectedFiles: [],
      convertedFiles: [],
      progress: 0,
      error: null,
    });
  },

  setOptions: (newOptions) => {
    set((state) => ({
      options: { ...state.options, ...newOptions },
    }));
  },

  convert: async () => {
    const { selectedFiles, options } = get();

    if (selectedFiles.length === 0) {
      set({ error: 'No files selected' });
      return;
    }

    set({ isConverting: true, progress: 0, error: null });

    try {
      const file = selectedFiles[0];
      const result = await convertImage(file, options);

      set((state) => ({
        convertedFiles: [...state.convertedFiles, result],
        isConverting: false,
        progress: 100,
      }));
    } catch (error) {
      set({
        isConverting: false,
        error: error instanceof Error ? error.message : 'Conversion failed',
      });
    }
  },

  convertAll: async () => {
    const { selectedFiles, options } = get();

    if (selectedFiles.length === 0) {
      set({ error: 'No files selected' });
      return;
    }

    set({ isConverting: true, progress: 0, error: null });

    try {
      const results = await convertBatch(selectedFiles, options, (current, total) => {
        set({ progress: Math.round((current / total) * 100) });
      });

      set((state) => ({
        convertedFiles: [...state.convertedFiles, ...results],
        isConverting: false,
        progress: 100,
      }));
    } catch (error) {
      set({
        isConverting: false,
        error: error instanceof Error ? error.message : 'Batch conversion failed',
      });
    }
  },

  clearConverted: () => {
    const { convertedFiles } = get();
    convertedFiles.forEach((f) => URL.revokeObjectURL(f.url));

    set({ convertedFiles: [], progress: 0 });
  },

  reset: () => {
    const { convertedFiles } = get();
    convertedFiles.forEach((f) => URL.revokeObjectURL(f.url));

    set({
      selectedFiles: [],
      convertedFiles: [],
      options: defaultOptions,
      isConverting: false,
      progress: 0,
      error: null,
    });
  },
}));
