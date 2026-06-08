import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeId =
  | 'default'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'neon'
  | 'monochrome'
  | 'royal'
  | 'midnight'
  | 'custom';

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  brand: Record<string, string>;
}

export const themes: ThemeDefinition[] = [
  {
    id: 'default',
    name: 'Violet',
    brand: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    brand: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    brand: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    brand: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    brand: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    brand: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  {
    id: 'royal',
    name: 'Royal',
    brand: {
      50: '#fef2f4',
      100: '#fde6ea',
      200: '#faccd6',
      300: '#f5a8b8',
      400: '#ef7d98',
      500: '#e54d74',
      600: '#cf2d5c',
      700: '#ae2047',
      800: '#8f1c3b',
      900: '#781935',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    brand: {
      50: '#eef2ff',
      100: '#dce4ff',
      200: '#b8c8ff',
      300: '#8fa8ff',
      400: '#6385ff',
      500: '#4a6cf7',
      600: '#3b5bdb',
      700: '#2646b5',
      800: '#1a3380',
      900: '#0c1d56',
    },
  },
];

interface ThemeStore {
  currentTheme: ThemeId;
  darkMode: boolean;
  customColor: string;
  setTheme: (id: ThemeId) => void;
  toggleDarkMode: () => void;
  setCustomColor: (color: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'default',
      darkMode: false,
      customColor: '#8b5cf6',
      setTheme: (id) => {
        set({ currentTheme: id });
        applyTheme(id, get().darkMode, get().customColor);
      },
      toggleDarkMode: () => {
        const next = !get().darkMode;
        set({ darkMode: next });
        applyTheme(get().currentTheme, next, get().customColor);
      },
      setCustomColor: (color) => {
        set({ customColor: color, currentTheme: 'custom' });
        applyTheme('custom', get().darkMode, color);
      },
    }),
    {
      name: 'converthub-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.currentTheme, !!state.darkMode, state.customColor);
        }
      },
    },
  ),
);

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [139, 92, 246];
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.round(Math.max(0, Math.min(255, n)));
  return `#${clamp(r).toString(16).padStart(2, '0')}${clamp(g).toString(16).padStart(2, '0')}${clamp(b).toString(16).padStart(2, '0')}`;
}

function mixWithWhite(r: number, g: number, b: number, ratio: number): [number, number, number] {
  return [r + (255 - r) * ratio, g + (255 - g) * ratio, b + (255 - b) * ratio];
}

function mixWithBlack(r: number, g: number, b: number, ratio: number): [number, number, number] {
  return [r * (1 - ratio), g * (1 - ratio), b * (1 - ratio)];
}

export function generatePalette(baseColor: string): Record<string, string> {
  const [r, g, b] = hexToRgb(baseColor);

  return {
    50: rgbToHex(...mixWithWhite(r, g, b, 0.92)),
    100: rgbToHex(...mixWithWhite(r, g, b, 0.80)),
    200: rgbToHex(...mixWithWhite(r, g, b, 0.60)),
    300: rgbToHex(...mixWithWhite(r, g, b, 0.40)),
    400: rgbToHex(...mixWithWhite(r, g, b, 0.20)),
    500: baseColor.startsWith('#') ? baseColor : `#${baseColor}`,
    600: rgbToHex(...mixWithBlack(r, g, b, 0.15)),
    700: rgbToHex(...mixWithBlack(r, g, b, 0.30)),
    800: rgbToHex(...mixWithBlack(r, g, b, 0.48)),
    900: rgbToHex(...mixWithBlack(r, g, b, 0.65)),
  };
}

let themeTransitionTimeout: ReturnType<typeof setTimeout> | null = null;

function applyTheme(id: ThemeId, dark: boolean, customColor?: string) {
  const root = document.documentElement;

  let palette: Record<string, string> | undefined;

  if (id === 'custom' && customColor) {
    palette = generatePalette(customColor);
  } else {
    const theme = themes.find((t) => t.id === id);
    if (theme) {
      palette = theme.brand;
    }
  }

  if (!palette) return;

  // Enable smooth transitions during theme change
  root.classList.add('theme-transitioning');

  // Cancel any pending timeout from a previous rapid theme change
  if (themeTransitionTimeout !== null) {
    clearTimeout(themeTransitionTimeout);
  }

  Object.entries(palette).forEach(([key, value]) => {
    root.style.setProperty(`--color-accent-${key}`, value);
    root.style.setProperty(`--color-brand-${key}`, value);
  });

  root.classList.toggle('dark', dark);

  // Keep the transition class for the full animation duration (300ms + buffer)
  themeTransitionTimeout = setTimeout(() => {
    root.classList.remove('theme-transitioning');
    themeTransitionTimeout = null;
  }, 350);
}

// Apply theme on initial load
if (typeof window !== 'undefined') {
  const applyStored = () => {
    const stored = localStorage.getItem('converthub-theme');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const state = parsed?.state;
        if (state) {
          applyTheme(state.currentTheme || 'default', !!state.darkMode, state.customColor);
        }
      } catch {
        // Ignore invalid JSON in localStorage
      }
    }
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(applyStored);
  } else {
    setTimeout(applyStored, 0);
  }
}
