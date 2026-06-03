import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const defaultDurations: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  info: 3000,
  warning: 4000,
};

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID();
    const duration = toast.duration ?? defaultDurations[toast.type];
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
    return id;
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearToasts: () => set({ toasts: [] }),
}));

// Helper for quick toasts
export const toast = {
  success: (message: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'success', message, description }),
  error: (message: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'error', message, description }),
  info: (message: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'info', message, description }),
  warning: (message: string, description?: string) =>
    useToastStore.getState().addToast({ type: 'warning', message, description }),
};
