import axios from "../axios";
import { useState, useEffect, createContext, useCallback } from "react";

const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  wishlist: [],
  addToCart: (productId, quantity) => {},
  removeFromCart: (productId) => {},
  updateCartQuantity: (productId, quantity) => {},
  refreshData: () => {},
  clearCart: () => {},
  fetchCart: () => {},
  // Wishlist
  fetchWishlist: () => {},
  addToWishlist: (productId) => {},
  removeFromWishlist: (productId) => {},
  moveToCartFromWishlist: (productId) => {},
  isInWishlist: (productId) => false,
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
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

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
    setToken(null);
    setUser(null);
    setCart([]);
    setWishlist([]);
  };

  // ─── Server-side Cart ────────────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!token) {
      setCart([]);
      return;
    }
    try {
      const response = await axios.get("/cart");
      setCart(response.data.cartItems || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      addToast("Please login to add items to cart", "warning");
      return;
    }
    try {
      const response = await axios.post("/cart/add", { productId, quantity });
      setCart(response.data.cartItems || []);
      addToast("Added to cart!", "success");
    } catch (error) {
      console.error("Error adding to cart:", error);
      addToast(error.response?.data?.message || "Failed to add to cart", "error");
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put("/cart/update", { productId, quantity });
      setCart(response.data.cartItems || []);
    } catch (error) {
      console.error("Error updating cart:", error);
      addToast(error.response?.data?.message || "Failed to update cart", "error");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await axios.delete(`/cart/remove/${productId}`);
      setCart(response.data.cartItems || []);
      addToast("Removed from cart", "info");
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      const response = await axios.delete("/cart/clear");
      setCart(response.data.cartItems || []);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // ─── Server-side Wishlist ────────────────────────────────────
  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    try {
      const response = await axios.get("/wishlist");
      setWishlist(response.data.products || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [token]);

  const addToWishlist = async (productId) => {
    if (!token) {
      addToast("Please login to add items to wishlist", "warning");
      return;
    }
    try {
      const response = await axios.post(`/wishlist/add/${productId}`);
      setWishlist(response.data.products || []);
      addToast("Added to wishlist!", "success");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      addToast("Failed to add to wishlist", "error");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await axios.delete(`/wishlist/remove/${productId}`);
      setWishlist(response.data.products || []);
      addToast("Removed from wishlist", "info");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const moveToCartFromWishlist = async (productId) => {
    try {
      await axios.post(`/wishlist/move-to-cart/${productId}`);
      await fetchWishlist();
      await fetchCart();
      addToast("Moved to cart!", "success");
    } catch (error) {
      console.error("Error moving to cart:", error);
      addToast("Failed to move to cart", "error");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  // ─── Products ────────────────────────────────────────────────
  const refreshData = async () => {
    try {
      const response = await axios.get("/products");
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  // Fetch products on mount
  useEffect(() => {
    refreshData();
  }, []);

  // Fetch cart and wishlist when user logs in
  useEffect(() => {
    if (token) {
      fetchCart();
      fetchWishlist();
    }
  }, [token, fetchCart, fetchWishlist]);

  return (
    <AppContext.Provider
      value={{
        data,
        isError,
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        refreshData,
        clearCart,
        fetchCart,
        fetchWishlist,
        addToWishlist,
        removeFromWishlist,
        moveToCartFromWishlist,
        isInWishlist,
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