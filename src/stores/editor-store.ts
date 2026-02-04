import { create } from 'zustand';
import { Event, Theme, ThemeConfig, BlockConfig, SeatingTable } from '@/types';
import { api } from '@/lib/api';

interface EditorState {
  event: Event | null;
  themes: Theme[];
  currentTheme: ThemeConfig | null;
  selectedBlockIndex: number | null;
  previewMode: 'desktop' | 'mobile';
  activePanel: 'blocks' | 'data' | 'theme' | 'guests' | 'seating' | 'ai';
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;

  // Actions
  loadEvent: (id: string) => Promise<void>;
  loadThemes: () => Promise<void>;
  updateData: (path: string, value: any) => void;
  changeTheme: (themeSlug: string) => void;
  updateCustomColor: (key: string, value: string) => void;
  reorderBlocks: (fromIndex: number, toIndex: number) => void;
  toggleBlock: (index: number) => void;
  setBlockVariant: (index: number, variant: string) => void;
  selectBlock: (index: number | null) => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  setActivePanel: (panel: 'blocks' | 'data' | 'theme' | 'guests' | 'seating' | 'ai') => void;
  saveEvent: () => Promise<void>;
  publishEvent: () => Promise<void>;
  updateSeating: (tables: SeatingTable[]) => void;

  // Computed
  enabledBlocks: () => BlockConfig[];
  mergedTheme: () => ThemeConfig | null;
}

function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split('.');
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
  return result;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  event: null,
  themes: [],
  currentTheme: null,
  selectedBlockIndex: null,
  previewMode: 'mobile',
  activePanel: 'data',
  isDirty: false,
  isSaving: false,
  isLoading: false,

  loadEvent: async (id: string) => {
    set({ isLoading: true });
    try {
      const event = await api.getEvent(id);
      const { themes } = get();

      let currentTheme: ThemeConfig | null = null;
      if (themes.length > 0 && event.theme?.id) {
        const theme = themes.find((t) => t.slug === event.theme.id);
        if (theme) {
          currentTheme = { ...theme.config };
          if (event.theme.customColors) {
            Object.entries(event.theme.customColors).forEach(([key, value]) => {
              if (key in currentTheme!.colors) {
                (currentTheme!.colors as any)[key] = value;
              }
            });
          }
        }
      }

      set({ event, currentTheme, isLoading: false, isDirty: false });
    } catch (error) {
      console.error('Failed to load event:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  loadThemes: async () => {
    try {
      const themes = await api.getThemes();
      set({ themes });

      // Update current theme if event is loaded
      const { event } = get();
      if (event?.theme?.id) {
        const theme = themes.find((t: Theme) => t.slug === event.theme.id);
        if (theme) {
          let currentTheme = { ...theme.config };
          if (event.theme.customColors) {
            Object.entries(event.theme.customColors).forEach(([key, value]) => {
              if (key in currentTheme.colors) {
                (currentTheme.colors as any)[key] = value;
              }
            });
          }
          set({ currentTheme });
        }
      }
    } catch (error) {
      console.error('Failed to load themes:', error);
    }
  },

  updateData: (path: string, value: any) => {
    const { event } = get();
    if (!event) return;

    const newData = setNestedValue(event.data, path, value);
    set({
      event: { ...event, data: newData },
      isDirty: true,
    });
  },

  changeTheme: (themeSlug: string) => {
    const { event, themes } = get();
    if (!event) return;

    const theme = themes.find((t) => t.slug === themeSlug);
    if (!theme) return;

    set({
      event: {
        ...event,
        theme: { id: themeSlug, customColors: {} },
      },
      currentTheme: { ...theme.config },
      isDirty: true,
    });
  },

  updateCustomColor: (key: string, value: string) => {
    const { event, currentTheme } = get();
    if (!event || !currentTheme) return;

    const customColors = { ...event.theme.customColors, [key]: value };
    const newColors = { ...currentTheme.colors, [key]: value };

    set({
      event: {
        ...event,
        theme: { ...event.theme, customColors },
      },
      currentTheme: { ...currentTheme, colors: newColors as any },
      isDirty: true,
    });
  },

  reorderBlocks: (fromIndex: number, toIndex: number) => {
    const { event } = get();
    if (!event) return;

    const blocks = [...event.blocks];
    const [removed] = blocks.splice(fromIndex, 1);
    blocks.splice(toIndex, 0, removed);

    // Update order values
    const reorderedBlocks = blocks.map((block, index) => ({
      ...block,
      order: index,
    }));

    set({
      event: { ...event, blocks: reorderedBlocks },
      isDirty: true,
    });
  },

  toggleBlock: (index: number) => {
    const { event } = get();
    if (!event) return;

    const blocks = [...event.blocks];
    blocks[index] = { ...blocks[index], enabled: !blocks[index].enabled };

    set({
      event: { ...event, blocks },
      isDirty: true,
    });
  },

  setBlockVariant: (index: number, variant: string) => {
    const { event } = get();
    if (!event) return;

    const blocks = [...event.blocks];
    blocks[index] = { ...blocks[index], variant };

    set({
      event: { ...event, blocks },
      isDirty: true,
    });
  },

  selectBlock: (index: number | null) => {
    set({ selectedBlockIndex: index });
  },

  setPreviewMode: (mode: 'desktop' | 'mobile') => {
    set({ previewMode: mode });
  },

  setActivePanel: (panel: 'blocks' | 'data' | 'theme' | 'guests' | 'seating' | 'ai') => {
    set({ activePanel: panel });
  },

  saveEvent: async () => {
    const { event } = get();
    if (!event) return;

    set({ isSaving: true });
    try {
      await api.updateEvent(event.id, {
        data: event.data,
        theme: event.theme,
        blocks: event.blocks,
        seating: event.seating,
      });
      set({ isDirty: false, isSaving: false });
    } catch (error) {
      console.error('Failed to save event:', error);
      set({ isSaving: false });
      throw error;
    }
  },

  publishEvent: async () => {
    const { event, saveEvent } = get();
    if (!event) return;

    // Save first if dirty
    if (get().isDirty) {
      await saveEvent();
    }

    try {
      const updated = await api.publishEvent(event.id);
      set({ event: updated });
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  },

  updateSeating: (tables: SeatingTable[]) => {
    const { event } = get();
    if (!event) return;

    set({
      event: { ...event, seating: tables },
      isDirty: true,
    });
  },

  enabledBlocks: () => {
    const { event } = get();
    if (!event) return [];
    return event.blocks
      .filter((b) => b.enabled)
      .sort((a, b) => a.order - b.order);
  },

  mergedTheme: () => {
    return get().currentTheme;
  },
}));
