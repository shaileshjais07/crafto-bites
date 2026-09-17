import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("craftoUser")) || null; }
    catch { return null; }
  });

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("craftoCart")) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("craftoCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) localStorage.setItem("craftoUser", JSON.stringify(user));
    else localStorage.removeItem("craftoUser");
  }, [user]);

  function login(data) {
    localStorage.setItem("craftoToken", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("craftoToken");
    setUser(null);
  }

  function addToCart(product, quantity = 1) {
    setCart(prev => {
      const found = prev.find(item => item.id === product.id);
      if (found) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }

  function updateCart(id, quantity) {
    if (quantity < 1) return removeFromCart(id);
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const total = subtotal + delivery;

  const value = useMemo(() => ({
    user, setUser, login, logout,
    cart, addToCart, updateCart, removeFromCart,
    cartCount, subtotal, delivery, total
  }), [user, cart, cartCount, subtotal, delivery, total]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
