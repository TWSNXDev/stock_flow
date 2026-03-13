import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + product.quantity, item.stock) }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: Math.min(product.quantity, product.stock) }] });
        }
      },

      removeItem: (id) => set({
        items: get().items.filter((item) => item.id !== id)
      }),

      updateQuantity: (id, quantity) => set({
        items: get().items.map((item) =>
          item.id === id ? { ...item, quantity: Math.min(quantity, item.stock) } : item
        )
      }),

      clearCart: () => set({ items: [] }),

      totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    { name: 'stock-flow-cart-storage' }
  )
);