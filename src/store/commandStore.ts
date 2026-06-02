import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CommandStore {
  favorites: string[];
  recentPaths: string[];
  addFavorite: (path: string) => void;
  removeFavorite: (path: string) => void;
  isFavorite: (path: string) => boolean;
  addRecent: (path: string) => void;
  clearRecent: () => void;
}

const MAX_RECENT = 5;

export const useCommandStore = create<CommandStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      recentPaths: [],

      addFavorite: (path) =>
        set((state) => ({
          favorites: state.favorites.includes(path) ? state.favorites : [...state.favorites, path],
        })),

      removeFavorite: (path) =>
        set((state) => ({
          favorites: state.favorites.filter((p) => p !== path),
        })),

      isFavorite: (path) => get().favorites.includes(path),

      addRecent: (path) =>
        set((state) => {
          const filtered = state.recentPaths.filter((p) => p !== path);
          return {
            recentPaths: [path, ...filtered].slice(0, MAX_RECENT),
          };
        }),

      clearRecent: () => set({ recentPaths: [] }),
    }),
    {
      name: 'converthub-commands',
    },
  ),
);
