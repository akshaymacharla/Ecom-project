import axios from "../axios";
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
  refreshData: () => {},
  updateStockQuantity: (productId, newQuantity) => {},
  clearCart: () => {},
  // Auth
  user: null,
  token: null,
  login: (authData) => {},
  logout: () => {},
  isAdmin: false,
  isLoggedIn: false,
  // Toasts
  toasts: [],
  addToast: (message, type, productName, imageUrl) => {},
  removeToast: (id) => {},
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  // Auth state — read from localStorage on load
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    return name ? { name, email, role, userId } : null;
  });

  // Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success", productName = "", imageUrl = "") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, productName, imageUrl }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const isLoggedIn = !!token;
  const isAdmin = user?.role === "ROLE_ADMIN";

  const login = (authData) => {
    // authData: { token, role, name, email, userId }
    localStorage.setItem("token", authData.token);
    localStorage.setItem("role", authData.role);
    localStorage.setItem("name", authData.name);
    localStorage.setItem("email", authData.email);
    localStorage.setItem("userId", authData.userId);
    setToken(authData.token);
    setUser({
      name: authData.name,
      email: authData.email,
      role: authData.role,
      userId: authData.userId,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("cart");
    setToken(null);
    setUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    addToast("Added to cart!", "success", product.name);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        addToCart,
        removeFromCart,
        refreshData,
        clearCart,
        user,
        token,
        login,
        logout,
        isAdmin,
        isLoggedIn,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;