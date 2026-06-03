import { useState, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export function useSystemTheme() {
  const [systemPrefersDark, setSystemPrefersDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return systemPrefersDark;
}

export function useAutoTheme() {
  const systemDark = useSystemTheme();
  useThemeStore(); // ensure store subscribes to re-renders

  // Apply system dark mode on initial load if no preference is stored
  useEffect(() => {
    const stored = localStorage.getItem('converthub-theme');
    if (!stored) {
      const root = document.documentElement;
      root.classList.toggle('dark', systemDark);
    }
  }, [systemDark]);

  return { systemDark, isAuto: !localStorage.getItem('converthub-theme') };
}
