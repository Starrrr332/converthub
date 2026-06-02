import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PremiumState {
  isPremium: () => boolean;
  setPlan: (plan: string) => void;
  setSubscription: (id: string, expiresAt: string) => void;
  setEmail: (email: string) => void;
  clearSubscription: () => void;
  checkPremium: () => boolean;
}

export const usePremiumStore = create<PremiumState>()(
  persist(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_set, _get) => ({
      isPremium: () => true,
      setPlan: () => {},
      setSubscription: () => {},
      setEmail: () => {},
      clearSubscription: () => {},
      checkPremium: () => true,
    }),
    {
      name: 'converthub-premium',
    },
  ),
);
