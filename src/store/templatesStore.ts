import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Template {
  id: string;
  name: string;
  toolPath: string;
  settings: Record<string, unknown>;
  createdAt: number;
}

interface TemplatesStore {
  templates: Template[];
  addTemplate: (name: string, toolPath: string, settings: Record<string, unknown>) => void;
  removeTemplate: (id: string) => void;
  getTemplatesForTool: (toolPath: string) => Template[];
  exportTemplates: () => string;
  importTemplates: (json: string) => boolean;
}

export const useTemplatesStore = create<TemplatesStore>()(
  persist(
    (set, get) => ({
      templates: [],

      addTemplate: (name, toolPath, settings) =>
        set((state) => ({
          templates: [
            ...state.templates,
            {
              id: `tpl-${Date.now()}`,
              name,
              toolPath,
              settings,
              createdAt: Date.now(),
            },
          ],
        })),

      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      getTemplatesForTool: (toolPath) =>
        get().templates.filter((t) => t.toolPath === toolPath),

      exportTemplates: () => JSON.stringify(get().templates, null, 2),

      importTemplates: (json) => {
        try {
          const parsed = JSON.parse(json);
          if (!Array.isArray(parsed)) return false;
          set({ templates: parsed });
          return true;
        } catch {
          return false;
        }
      },
    }),
    { name: 'converthub-templates' }
  )
);
