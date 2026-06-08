import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="access-denied-page">
      <div className="access-denied-card">
        <div className="access-denied-icon">🔒</div>
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to view this page. This area is restricted to administrators only.</p>
        <div className="access-denied-actions">
          <button className="access-denied-back" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-2"></i>
            Go Back
          </button>
          <Link to="/" className="access-denied-home">
            <i className="bi bi-house-fill me-2"></i>
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
