import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CATEGORY_PRELOAD_MAP: Record<string, string[]> = {
  '/converter/image': ['/converter/pdf', '/converter/heic'],
  '/converter/pdf': ['/converter/image', '/converter/epub'],
  '/converter/csv': ['/converter/image', '/converter/audio'],
  '/converter/audio': ['/converter/video', '/converter/csv'],
  '/converter/video': ['/converter/audio', '/converter/image'],
  '/converter/epub': ['/converter/pdf', '/converter/heic'],
  '/converter/heic': ['/converter/image', '/converter/epub'],
};

export function useSmartPreload(delay: number = 3000) {
  const location = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefetchedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const paths = CATEGORY_PRELOAD_MAP[location.pathname];
    if (!paths) return;

    timerRef.current = setTimeout(() => {
      for (const path of paths) {
        if (prefetchedRef.current.has(path)) continue;
        prefetchedRef.current.add(path);

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = path;
        document.head.appendChild(link);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [location.pathname, delay]);
}
