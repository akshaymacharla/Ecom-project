import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";

const AdminDashboard = () => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ products: 0, users: 0, orders: 0 });
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, usersRes, ordersRes] = await Promise.all([
        axios.get("/products"),
        axios.get("/users"),
        axios.get("/orders/all"),
      ]);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
      setOrders(ordersRes.data);
      setStats({
        products: productsRes.data.length,
        users: usersRes.data.length,
        orders: ordersRes.data.length,
      });
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await axios.delete(`/product/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      setStats((s) => ({ ...s, products: s.products - 1 }));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await axios.delete(`/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setStats((s) => ({ ...s, users: s.users - 1 }));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleToggleUserStatus = async (id) => {
    try {
      await axios.put(`/users/${id}/toggle-status`);
      setUsers(users.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)));
    } catch (err) {
      alert("Failed to update user status");
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/orders/${orderId}/status`, { status });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, orderStatus: status.toUpperCase() } : o)));
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== "CANCELLED")
    .reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="admin-brand-icon">🛒</span>
          <span>BuyThings</span>
        </div>
        <nav className="admin-nav">
          {[
            { id: "overview", icon: "bi-grid-fill", label: "Overview" },
            { id: "products", icon: "bi-box-seam", label: "Products" },
            { id: "orders", icon: "bi-bag-check", label: "Orders" },
            { id: "users", icon: "bi-people-fill", label: "Users" },
          ].map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              <i className={`bi ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
          <Link to="/add_product" className="admin-nav-item">
            <i className="bi bi-plus-circle-fill"></i>
            Add Product
          </Link>
          <Link to="/" className="admin-nav-item">
            <i className="bi bi-shop"></i>
            View Store
          </Link>
        </nav>
        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">{user?.name?.[0]?.toUpperCase()}</div>
            <div>
              <div className="admin-user-name">{user?.name}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <h2 className="admin-page-title">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "products" && "Product Management"}
            {activeTab === "orders" && "Order Management"}
            {activeTab === "users" && "User Management"}
          </h2>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading data...</p>
          </div>
        ) : (
          <>
            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <div className="admin-stats-grid">
                  {[
                    { label: "Total Products", value: stats.products, icon: "bi-box-seam", color: "#6366f1" },
                    { label: "Total Users", value: stats.users, icon: "bi-people-fill", color: "#10b981" },
                    { label: "Total Orders", value: stats.orders, icon: "bi-bag-check", color: "#f59e0b" },
                    { label: "Revenue", value: `₹${totalRevenue.toFixed(2)}`, icon: "bi-currency-rupee", color: "#ef4444" },
                  ].map((stat) => (
                    <div className="admin-stat-card" key={stat.label}>
                      <div className="admin-stat-icon" style={{ background: stat.color }}>
                        <i className={`bi ${stat.icon}`}></i>
                      </div>
                      <div className="admin-stat-info">
                        <div className="admin-stat-value">{stat.value}</div>
                        <div className="admin-stat-label">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="admin-recent">
                  <h3>Recent Orders</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                          <td>₹{parseFloat(o.totalAmount).toFixed(2)}</td>
                          <td>
                            <span className={`status-badge status-${o.orderStatus?.toLowerCase()}`}>
                              {o.orderStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PRODUCTS */}
            {activeTab === "products" && (
              <div>
                <div className="admin-actions-bar">
                  <Link to="/add_product" className="admin-add-btn">
                    <i className="bi bi-plus-lg me-2"></i>Add New Product
                  </Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td>{p.name}</td>
                        <td>{p.brand}</td>
                        <td>{p.category}</td>
                        <td>₹{p.price}</td>
                        <td>
                          <span className={p.stockQuantity > 0 ? "stock-ok" : "stock-out"}>
                            {p.stockQuantity}
                          </span>
                        </td>
                        <td className="admin-table-actions">
                          <Link to={`/product/update/${p.id}`} className="admin-edit-btn">
                            <i className="bi bi-pencil-fill"></i>
                          </Link>
                          <button className="admin-delete-btn" onClick={() => handleDeleteProduct(p.id)}>
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.user?.name || o.user?.email}</td>
                      <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                      <td>{o.orderItems?.length || 0} items</td>
                      <td>₹{parseFloat(o.totalAmount).toFixed(2)}</td>
                      <td>
                        <span className={`status-badge status-${o.orderStatus?.toLowerCase()}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="admin-status-select"
                          value={o.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        >
                          {["PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELLED"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* USERS */}
            {activeTab === "users" && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge ${u.role === "ROLE_ADMIN" ? "role-admin" : "role-user"}`}>
                          {u.role === "ROLE_ADMIN" ? "Admin" : "User"}
                        </span>
                      </td>
                      <td>
                        <span className={u.enabled ? "status-active" : "status-inactive"}>
                          {u.enabled ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="admin-table-actions">
                        <button
                          className={u.enabled ? "admin-disable-btn" : "admin-enable-btn"}
                          onClick={() => handleToggleUserStatus(u.id)}
                        >
                          <i className={`bi ${u.enabled ? "bi-person-dash" : "bi-person-check"}`}></i>
                        </button>
                        <button className="admin-delete-btn" onClick={() => handleDeleteUser(u.id)}>
                          <i className="bi bi-trash3-fill"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
