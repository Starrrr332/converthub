import { create } from 'zustand';

export interface Tab {
  id: string;
  path: string;
  label: string;
}

interface TabsStore {
  tabs: Tab[];
  activeTab: string | null;
  addTab: (path: string, label: string) => void;
  removeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  reorderTabs: (fromIndex: number, toIndex: number) => void;
}

const MAX_TABS = 5;

export const useTabsStore = create<TabsStore>()((set) => ({
  tabs: [],
  activeTab: null,

  addTab: (path, label) =>
    set((state) => {
      // Check if tab already exists
      const existing = state.tabs.find((t) => t.path === path);
      if (existing) {
        return { activeTab: existing.id };
      }

      // Remove oldest if at max
      const tabs = state.tabs.length >= MAX_TABS ? state.tabs.slice(1) : state.tabs;

      const id = `${path}-${Date.now()}`;
      return {
        tabs: [...tabs, { id, path, label }],
        activeTab: id,
      };
    }),

  removeTab: (id) =>
    set((state) => {
      const tabs = state.tabs.filter((t) => t.id !== id);
      const activeTab =
        state.activeTab === id ? tabs[tabs.length - 1]?.id || null : state.activeTab;
      return { tabs, activeTab };
    }),

  setActiveTab: (id) => set({ activeTab: id }),

  reorderTabs: (fromIndex, toIndex) =>
    set((state) => {
      const tabs = [...state.tabs];
      const [removed] = tabs.splice(fromIndex, 1);
      tabs.splice(toIndex, 0, removed);
      return { tabs };
    }),
}));
