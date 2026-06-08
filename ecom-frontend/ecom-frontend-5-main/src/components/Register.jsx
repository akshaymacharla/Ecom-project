import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";

const Register = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "ROLE_USER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      login(response.data);
      if (response.data.role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <div className="auth-logo">🛒</div>
          <h1 className="auth-title">BuyThings</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <div className="auth-error">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="reg-name">Full Name</label>
            <div className="auth-input-wrap">
              <i className="bi bi-person auth-input-icon"></i>
              <input
                id="reg-name"
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email">Email Address</label>
            <div className="auth-input-wrap">
              <i className="bi bi-envelope auth-input-icon"></i>
              <input
                id="reg-email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password">Password</label>
            <div className="auth-input-wrap">
              <i className="bi bi-lock auth-input-icon"></i>
              <input
                id="reg-password"
                type="password"
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <div className="auth-input-wrap">
              <i className="bi bi-lock-fill auth-input-icon"></i>
              <input
                id="reg-confirm"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-role">Account Type</label>
            <div className="auth-input-wrap">
              <i className="bi bi-shield auth-input-icon"></i>
              <select
                id="reg-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="auth-select"
              >
                <option value="ROLE_USER">Customer</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Creating account...
              </>
            ) : (
              <>
                <i className="bi bi-person-plus me-2"></i>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
