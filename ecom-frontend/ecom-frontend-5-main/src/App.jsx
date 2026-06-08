import "./App.css";
import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import UpdateProduct from "./components/UpdateProduct";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import OrderHistory from "./components/OrderHistory";
import Profile from "./components/Profile";
import AccessDenied from "./components/AccessDenied";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";
import Wishlist from "./components/Wishlist";
import AddressManager from "./components/AddressManager";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import AppContext from "./Context/Context";
import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Wrapper to conditionally render Navbar (hide on admin and auth pages)
const AppRoutes = () => {
  const { selectedCategory: _sc, toasts, removeToast } = useContext(AppContext);
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("");

  const hideNavbarPaths = ["/login", "/register", "/admin"];
  const shouldHideNavbar = hideNavbarPaths.some((p) => location.pathname.startsWith(p));

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Toast toasts={toasts} removeToast={removeToast} />
      {!shouldHideNavbar && (
        <Navbar onSelectCategory={handleCategorySelect} />
      )}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/access-denied" element={<AccessDenied />} />
        <Route path="/product" element={<Product />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />

        {/* Protected — any authenticated user */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <AddressManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add_product"
          element={
            <ProtectedRoute adminOnly>
              <AddProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/update/:id"
          element={
            <ProtectedRoute adminOnly>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
