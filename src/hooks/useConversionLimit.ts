import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConversionLimitState {
  // State
  date: string;
  count: number;
  limit: number;

  // Actions
  incrementUsage: () => void;
  resetDaily: () => void;
  getRemaining: () => number;
  canConvert: () => boolean;
}

const FREE_DAILY_LIMIT = 50;

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export const useConversionLimit = create<ConversionLimitState>()(
  persist(
    (set, get) => ({
      // Initial state
      date: getTodayString(),
      count: 0,
      limit: FREE_DAILY_LIMIT,

      // Actions
      incrementUsage: () => {
        const state = get();
        const today = getTodayString();

        // Reset if new day
        if (state.date !== today) {
          set({ date: today, count: 1 });
        } else {
          set({ count: state.count + 1 });
        }
      },

      resetDaily: () => {
        set({ date: getTodayString(), count: 0 });
      },

      getRemaining: () => {
        const state = get();
        const today = getTodayString();

        // Reset if new day
        if (state.date !== today) {
          return state.limit;
        }

        return Math.max(0, state.limit - state.count);
      },

      canConvert: () => {
        const state = get();
        const today = getTodayString();

        // Reset if new day
        if (state.date !== today) {
          return true;
        }

        return state.count < state.limit;
      },
    }),
    {
      name: 'converthub-limits',
    },
  ),
);
