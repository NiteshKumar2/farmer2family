
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  unit?: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("farmer2family-cart");
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Unable to load cart:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("farmer2family-cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((current) => {
      const existing = current.find((product) => product._id === item._id);

      if (existing) {
        return current.map((product) =>
          product._id === item._id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((current) =>
      current.map((item) =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setItems((current) => current.filter((item) => item._id !== id));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}