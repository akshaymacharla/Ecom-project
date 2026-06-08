import React, { useEffect, useState } from "react";
import "../App.css";

/**
 * Toast notification component.
 * Props:
 *   toasts: [{ id, message, type: 'success'|'error'|'info', productName, imageUrl }]
 *   removeToast: (id) => void
 */
const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.imageUrl && (
            <img
              src={toast.imageUrl}
              alt=""
              className="toast-img"
            />
          )}
          <div className="toast-content">
            <div className="toast-icon">
              {toast.type === "success" && <i className="bi bi-cart-check-fill"></i>}
              {toast.type === "error" && <i className="bi bi-exclamation-circle-fill"></i>}
              {toast.type === "info" && <i className="bi bi-info-circle-fill"></i>}
            </div>
            <div className="toast-text">
              <div className="toast-title">{toast.message}</div>
              {toast.productName && (
                <div className="toast-product">{toast.productName}</div>
              )}
            </div>
          </div>
          <div className="toast-progress">
            <div className="toast-progress-bar" style={{ animationDuration: "3s" }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
