import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";
import AppContext from "../Context/Context";

const Profile = () => {
  const { user, login } = useContext(AppContext);
  const [name, setName] = useState(user?.name || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/users/me");
      setProfile(res.data);
      setName(res.data.name);
    } catch (err) {
      setError("Could not load profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.put("/users/me", { name });
      setProfile(res.data);
      // Update local auth state too
      const token = localStorage.getItem("token");
      login({ ...res.data, token, role: res.data.role, userId: res.data.id });
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <Link to="/dashboard" className="profile-back">
            <i className="bi bi-arrow-left me-2"></i>Dashboard
          </Link>
          <div className="profile-avatar">{name?.[0]?.toUpperCase()}</div>
          <h2>{profile?.name || user?.name}</h2>
          <p className="profile-role">
            {profile?.role === "ROLE_ADMIN" ? "🛡️ Administrator" : "👤 Customer"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {success && (
            <div className="profile-success">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}
          {error && (
            <div className="profile-error">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <div className="profile-field">
            <label htmlFor="profile-name">Full Name</label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="profile-field">
            <label>Email Address</label>
            <input type="email" value={profile?.email || user?.email || ""} disabled />
            <small>Email cannot be changed</small>
          </div>

          <div className="profile-field">
            <label>Account Type</label>
            <input
              type="text"
              value={profile?.role === "ROLE_ADMIN" ? "Administrator" : "Customer"}
              disabled
            />
          </div>

          <button type="submit" className="profile-save-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-2"></i>
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
