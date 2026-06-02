import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PremiumState {
  isPremium: boolean;
  subscriptionId: string | null;
  plan: 'free' | 'monthly' | 'annual' | null;
  email: string | null;
  expiresAt: string | null;

  setPremium: (subscriptionId: string, plan: 'monthly' | 'annual', email: string, expiresAt: string) => void;
  setPlan: (plan: string) => void;
  setSubscription: (id: string, expiresAt: string) => void;
  setEmail: (email: string) => void;
  clearSubscription: () => void;
  checkPremium: () => boolean;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    (set, get) => ({
      isPremium: false,
      subscriptionId: null,
      plan: 'free' as const,
      email: null,
      expiresAt: null,

      setPremium: (subscriptionId, plan, email, expiresAt) => {
        set({
          isPremium: true,
          subscriptionId,
          plan,
          email,
          expiresAt,
        });
      },

      setPlan: (plan) => {
        set({ plan: plan as 'monthly' | 'annual' });
      },

      setSubscription: (id, expiresAt) => {
        set({
          isPremium: true,
          subscriptionId: id,
          expiresAt,
        });
      },

      setEmail: (email) => {
        set({ email });
      },

      clearSubscription: () => {
        set({
          isPremium: false,
          subscriptionId: null,
          plan: 'free',
          email: null,
          expiresAt: null,
        });
      },

      checkPremium: () => {
        const state = get();
        if (!state.isPremium || !state.expiresAt) return false;

        // Check if subscription has expired
        const expires = new Date(state.expiresAt);
        if (expires < new Date()) {
          // Auto-clear expired subscriptions
          set({
            isPremium: false,
            subscriptionId: null,
            plan: 'free',
            expiresAt: null,
          });
          return false;
        }

        return true;
      },
    }),
    {
      name: 'converthub-premium',
    },
  ),
);
