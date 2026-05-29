import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PremiumPlan } from '../types';

interface PremiumState {
  // State
  plan: PremiumPlan;
  subscriptionId: string | null;
  expiresAt: string | null;
  email: string | null;
  
  // Computed
  isPremium: () => boolean;
  
  // Actions
  setPlan: (plan: PremiumPlan) => void;
  setSubscription: (id: string, expiresAt: string) => void;
  setEmail: (email: string) => void;
  clearSubscription: () => void;
  checkPremium: () => boolean;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set, get) => ({
      // Initial state
      plan: 'free',
      subscriptionId: null,
      expiresAt: null,
      email: null,
      
      // Computed
      isPremium: () => {
        const state = get();
        if (state.plan !== 'premium') return false;
        if (!state.expiresAt) return true;
        return new Date(state.expiresAt) > new Date();
      },
      
      // Actions
      setPlan: (plan) => {
        set({ plan });
      },
      
      setSubscription: (id, expiresAt) => {
        set({
          plan: 'premium',
          subscriptionId: id,
          expiresAt
        });
      },
      
      setEmail: (email) => {
        set({ email });
      },
      
      clearSubscription: () => {
        set({
          plan: 'free',
          subscriptionId: null,
          expiresAt: null
        });
      },
      
      checkPremium: () => {
        const state = get();
        return state.isPremium();
      }
    }),
    {
      name: 'converthub-premium'
    }
  )
);
