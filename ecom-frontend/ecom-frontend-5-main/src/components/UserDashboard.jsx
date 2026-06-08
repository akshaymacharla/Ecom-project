import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";

const UserDashboard = () => {
  const { user, cart, wishlist, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="user-dashboard">
      <div className="user-dashboard-hero">
        <div className="user-avatar-large">{user?.name?.[0]?.toUpperCase()}</div>
        <h2>Welcome back, {user?.name}!</h2>
        <p className="user-email">{user?.email}</p>
      </div>

      <div className="user-dashboard-grid">
        <Link to="/" className="user-dash-card">
          <div className="user-dash-icon">🛍️</div>
          <h3>Browse Products</h3>
          <p>Explore our full catalog</p>
        </Link>
        <Link to="/cart" className="user-dash-card">
          <div className="user-dash-icon">🛒</div>
          <h3>My Cart</h3>
          <p>{cart.length} item{cart.length !== 1 ? "s" : ""} waiting</p>
        </Link>
        <Link to="/wishlist" className="user-dash-card">
          <div className="user-dash-icon">❤️</div>
          <h3>My Wishlist</h3>
          <p>{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
        </Link>
        <Link to="/orders" className="user-dash-card">
          <div className="user-dash-icon">📦</div>
          <h3>My Orders</h3>
          <p>Track your purchases</p>
        </Link>
        <Link to="/addresses" className="user-dash-card">
          <div className="user-dash-icon">📍</div>
          <h3>My Addresses</h3>
          <p>Manage delivery addresses</p>
        </Link>
        <Link to="/profile" className="user-dash-card">
          <div className="user-dash-icon">👤</div>
          <h3>My Profile</h3>
          <p>Update your information</p>
        </Link>
      </div>

      <div className="user-dashboard-actions">
        <button className="btn-logout-dash" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
