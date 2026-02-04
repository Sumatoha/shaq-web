import { create } from 'zustand';

interface AIDesignState {
  currentHtml: string;
  isAIPreviewMode: boolean;
  setCurrentHtml: (html: string) => void;
  setAIPreviewMode: (enabled: boolean) => void;
  clear: () => void;
}

export const useAIDesignStore = create<AIDesignState>((set) => ({
  currentHtml: '',
  isAIPreviewMode: false,

  setCurrentHtml: (html: string) => {
    set({ currentHtml: html, isAIPreviewMode: html.length > 0 });
  },

  setAIPreviewMode: (enabled: boolean) => {
    set({ isAIPreviewMode: enabled });
  },

  clear: () => {
    set({ currentHtml: '', isAIPreviewMode: false });
  },
}));
