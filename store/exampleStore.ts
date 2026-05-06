import { create } from 'zustand';
import type { Item } from '@/lib/db/schema';

interface ItemState {
  items: Item[];
  isLoading: boolean;

  setItems: (items: Item[]) => void;
  setLoading: (loading: boolean) => void;
  upsertItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

export const useItemStore = create<ItemState>((set) => ({
  items: [],
  isLoading: false,

  setItems: (items) => set({ items }),
  setLoading: (isLoading) => set({ isLoading }),

  upsertItem: (item) =>
    set((state) => {
      const exists = state.items.some((i) => i.id === item.id);
      return {
        items: exists
          ? state.items.map((i) => (i.id === item.id ? item : i))
          : [item, ...state.items],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));
