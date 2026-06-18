import React, { createContext, useContext } from 'react';
import { create } from 'zustand';
import type { AddToCartPayload } from '@/types';

// ─── Zustand Store ────────────────────────────────────────────────────────────

type CartEntry = AddToCartPayload & { quantity: number };

type CartState = {
  items: Record<string, CartEntry>;
  totalCount: number;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: {},
  totalCount: 0,

  addItem: (payload) =>
    set((state) => {
      const existing = state.items[payload.id];
      const updated: CartEntry = existing
        ? { ...existing, quantity: existing.quantity + 1 }
        : { ...payload, quantity: 1 };
      return {
        items: { ...state.items, [payload.id]: updated },
        totalCount: state.totalCount + 1,
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const existing = state.items[id];
      if (!existing) return state;
      if (existing.quantity <= 1) {
        const { [id]: _removed, ...rest } = state.items;
        return { items: rest, totalCount: state.totalCount - 1 };
      }
      return {
        items: { ...state.items, [id]: { ...existing, quantity: existing.quantity - 1 } },
        totalCount: state.totalCount - 1,
      };
    }),

  clearCart: () => set({ items: {}, totalCount: 0 }),
}));

// ─── Per-item selector hook ───────────────────────────────────────────────────
// Subscribes only to a single product's quantity. Mutating product A will not
// cause product B's card to re-render — a key architectural mandate.

export function useCartItem(productId: string): number {
  return useCartStore((state) => state.items[productId]?.quantity ?? 0);
}

export function useCartTotal(): number {
  return useCartStore((state) => state.totalCount);
}

// ─── Context + Provider (thin wrapper for component tree integration) ─────────

const CartContext = createContext<null>(null);

type Props = { children: React.ReactNode };

export function CartProvider({ children }: Props) {
  return <CartContext.Provider value={null}>{children}</CartContext.Provider>;
}

export function useCart() {
  useContext(CartContext);
  return useCartStore;
}
