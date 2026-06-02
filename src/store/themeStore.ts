import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId = 'default' | 'ocean' | 'forest' | 'sunset' | 'neon' | 'monochrome';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  brand: Record<string, string>;
}

export const themes: ThemeDefinition[] = [
  {
    id: 'default',
    name: 'Default (Indigo)',
    brand: {
      50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
      400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca',
      800: '#3730a3', 900: '#312e81',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean (Blue)',
    brand: {
      50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd',
      400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8',
      800: '#1e40af', 900: '#1e3a8a',
    },
  },
  {
    id: 'forest',
    name: 'Forest (Green)',
    brand: {
      50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac',
      400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d',
      800: '#166534', 900: '#14532d',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset (Orange)',
    brand: {
      50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74',
      400: '#fb923c', 500: '#f97316', 600: '#ea580c', 700: '#c2410c',
      800: '#9a3412', 900: '#7c2d12',
    },
  },
  {
    id: 'neon',
    name: 'Neon (Cyan)',
    brand: {
      50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9',
      400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490',
      800: '#155e75', 900: '#164e63',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    brand: {
      50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
      400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155',
      800: '#1e293b', 900: '#0f172a',
    },
  },
];

interface ThemeStore {
  currentTheme: ThemeId;
  setTheme: (id: ThemeId) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: 'default',
      setTheme: (id) => {
        set({ currentTheme: id });
        applyTheme(id);
      },
    }),
    {
      name: 'converthub-theme',
      onRehydrateStorage: () => (state) => {
        if (state?.currentTheme) {
          applyTheme(state.currentTheme);
        }
      },
    }
  )
);

function applyTheme(id: ThemeId) {
  const theme = themes.find((t) => t.id === id);
  if (!theme) return;

  const root = document.documentElement;
  Object.entries(theme.brand).forEach(([key, value]) => {
    root.style.setProperty(`--color-brand-${key}`, value);
  });
}

// Apply theme on initial load
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('converthub-theme');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const id = parsed?.state?.currentTheme as ThemeId;
      if (id) applyTheme(id);
    } catch { /* ignore parse errors */ }
  }
}
