import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders/my");
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    PENDING: "#f59e0b",
    CONFIRMED: "#3b82f6",
    SHIPPED: "#8b5cf6",
    DELIVERED: "#10b981",
    CANCELLED: "#ef4444",
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <Link to="/dashboard" className="orders-back">
          <i className="bi bi-arrow-left me-2"></i>Dashboard
        </Link>
        <h1>My Orders</h1>
        <p>{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
      </div>

      {error && <div className="orders-error">{error}</div>}

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start shopping to see your orders here</p>
          <Link to="/" className="orders-shop-btn">Browse Products</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">
                    {new Date(order.orderDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className="order-status-badge"
                  style={{ background: statusColor[order.orderStatus] || "#6b7280" }}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="order-items-list">
                {order.orderItems?.map((item) => (
                  <div className="order-item-row" key={item.id}>
                    <span className="order-item-name">{item.product?.name}</span>
                    <span className="order-item-qty">× {item.quantity}</span>
                    <span className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <span className="order-items-count">
                  {order.orderItems?.length || 0} item{order.orderItems?.length !== 1 ? "s" : ""}
                </span>
                <span className="order-total">
                  Total: <strong>₹{parseFloat(order.totalAmount).toFixed(2)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
