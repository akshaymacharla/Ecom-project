import React, { useContext } from "react";
import AppContext from "../Context/Context";

/**
 * CheckoutPopup — shows order summary and triggers Razorpay payment.
 * Uses Razorpay TEST mode key. Replace key_id with your real key in production.
 */
const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  const { user, addToast } = useContext(AppContext);

  if (!show) return null;

  // Convert total to paise (Razorpay requires amount in smallest currency unit)
  const amountInPaise = Math.round(totalPrice * 100);

  const handleRazorpayPayment = () => {
    const options = {
      // ─── KEY READ FROM .env (VITE_RAZORPAY_KEY_ID) — never hardcoded ───
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      name: "BuyThings",
      description: `Order of ${cartItems.length} item(s)`,
      image: "https://i.ibb.co/5W1pGwV/buythings-logo.png", // optional logo
      handler: async function (response) {
        // Payment success — response.razorpay_payment_id is available
        console.log("Payment successful:", response.razorpay_payment_id);
        await handleCheckout(); // update stock + clear cart
        addToast(
          "🎉 Payment Successful!",
          "success",
          `Payment ID: ${response.razorpay_payment_id}`
        );
        handleClose();
      },
      prefill: {
        name: user?.name || "Customer",
        email: user?.email || "",
        contact: "",
      },
      notes: {
        items: cartItems.map((i) => i.name).join(", "),
      },
      theme: {
        color: "#6366f1",
      },
      modal: {
        ondismiss: () => {
          addToast("Payment cancelled.", "info");
        },
      },
    };

    // Razorpay is loaded via CDN in index.html
    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      addToast("Payment failed. Please try again.", "error");
    });

    rzp.open();
  };

  return (
    <div className="razorpay-modal-overlay" onClick={handleClose}>
      <div
        className="razorpay-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="razorpay-modal-header">
          <div className="razorpay-modal-title">
            <i className="bi bi-bag-check-fill"></i>
            Order Summary
          </div>
          <button className="razorpay-modal-close" onClick={handleClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="razorpay-modal-body">
          <div className="checkout-items-list">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item-row">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="checkout-item-img"
                />
                <div className="checkout-item-info">
                  <div className="checkout-item-name">{item.name}</div>
                  <div className="checkout-item-brand">{item.brand}</div>
                  <div className="checkout-item-qty">Qty: {item.quantity}</div>
                </div>
                <div className="checkout-item-price">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-total-row">
            <span className="checkout-total-label">
              <i className="bi bi-receipt"></i> Total Amount
            </span>
            <span className="checkout-total-amount">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>

          <div className="razorpay-info-box">
            <i className="bi bi-shield-lock-fill"></i>
            <span>Payments secured by <strong>Razorpay</strong></span>
            <img
              src="https://razorpay.com/favicon.png"
              alt="Razorpay"
              style={{ width: 20, height: 20, borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="razorpay-modal-footer">
          <button className="checkout-cancel-btn" onClick={handleClose}>
            <i className="bi bi-arrow-left"></i> Back to Cart
          </button>
          <button
            className="checkout-pay-btn"
            onClick={handleRazorpayPayment}
          >
            <i className="bi bi-credit-card-fill"></i>
            Pay ₹{totalPrice.toLocaleString()} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
