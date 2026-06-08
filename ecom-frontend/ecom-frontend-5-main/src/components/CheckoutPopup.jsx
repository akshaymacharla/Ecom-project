import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import { Link } from "react-router-dom";

/**
 * CheckoutPopup — shows order summary, address selection, and triggers Razorpay payment.
 */
const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout }) => {
  const { user, addToast } = useContext(AppContext);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (show && user) {
      fetchAddresses();
    }
  }, [show, user]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await axios.get("/address");
      const fetchedAddresses = response.data;
      setAddresses(fetchedAddresses);
      
      // Auto-select default address if exists, otherwise pick the first one
      if (fetchedAddresses.length > 0) {
        const defaultAddr = fetchedAddresses.find(a => a.default || a.isDefault);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : fetchedAddresses[0].id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      addToast("Failed to load addresses", "error");
    } finally {
      setLoadingAddresses(false);
    }
  };

  if (!show) return null;

  const amountInPaise = Math.round(totalPrice * 100);

  const getSelectedAddressText = () => {
    const addr = addresses.find(a => a.id === selectedAddressId);
    if (!addr) return "No address provided";
    return `${addr.fullName}, ${addr.addressLine1}, ${addr.city}, ${addr.state} - ${addr.pincode}, ${addr.country} (Phone: ${addr.phoneNumber})`;
  };

  const handleRazorpayPayment = () => {
    if (!selectedAddressId || addresses.length === 0) {
      addToast("Please select or add a shipping address", "warning");
      return;
    }

    const shippingAddress = getSelectedAddressText();
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: "INR",
      name: "BuyThings",
      description: `Order of ${cartItems.length} item(s)`,
      image: "https://i.ibb.co/5W1pGwV/buythings-logo.png",
      handler: async function (response) {
        console.log("Payment successful:", response.razorpay_payment_id);
        setIsProcessing(true);
        try {
          // Pass the selected address to the Cart's handleCheckout
          await handleCheckout(shippingAddress);
          addToast(
            "🎉 Order Placed Successfully!",
            "success",
            `Payment ID: ${response.razorpay_payment_id}`
          );
        } catch (error) {
          // Error already handled by handleCheckout, but we reset processing state
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: user?.name || "Customer",
        email: user?.email || "",
        contact: "",
      },
      notes: {
        items: cartItems.map((i) => i.name).join(", "),
        shippingAddress: shippingAddress,
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
        style={{ maxWidth: "600px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="razorpay-modal-header">
          <div className="razorpay-modal-title">
            <i className="bi bi-bag-check-fill"></i>
            Checkout
          </div>
          <button className="razorpay-modal-close" onClick={handleClose} disabled={isProcessing}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="razorpay-modal-body">
          {/* Address Selection Section */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h6 style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="bi bi-geo-alt-fill" style={{ color: "#6366f1" }}></i>
                Shipping Address
              </h6>
              <Link to="/addresses" onClick={handleClose} style={{ fontSize: "0.85rem", textDecoration: "none" }}>
                Manage Addresses
              </Link>
            </div>
            
            {loadingAddresses ? (
              <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div style={{ padding: "15px", background: "#fff3cd", color: "#856404", borderRadius: "6px", fontSize: "0.9rem" }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                You don't have any addresses saved. Please add one to continue.
                <div className="mt-2">
                  <Link to="/addresses" className="btn btn-sm btn-warning" onClick={handleClose}>
                    Add Address
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "10px",
                      border: `1px solid ${selectedAddressId === addr.id ? "#6366f1" : "#ddd"}`,
                      borderRadius: "6px",
                      background: selectedAddressId === addr.id ? "#f5f6ff" : "#fff",
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <input
                      type="radio"
                      name="shippingAddress"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      style={{ marginTop: "4px" }}
                    />
                    <div style={{ fontSize: "0.9rem" }}>
                      <strong>{addr.fullName}</strong>
                      {(addr.default || addr.isDefault) && (
                        <span className="badge bg-secondary ms-2" style={{ fontSize: "0.65rem" }}>Default</span>
                      )}
                      <div style={{ color: "#555", marginTop: "2px" }}>
                        {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                        <br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <hr style={{ borderTop: "1px dashed #ccc", margin: "15px 0" }} />

          {/* Order Summary Section */}
          <h6 style={{ margin: "0 0 10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <i className="bi bi-cart-check-fill" style={{ color: "#6366f1" }}></i>
            Order Summary
          </h6>
          <div className="checkout-items-list" style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid #eee", padding: "10px", borderRadius: "6px" }}>
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-item-row" style={{ padding: "6px 0", borderBottom: "1px solid #f5f5f5" }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="checkout-item-img"
                  style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                />
                <div className="checkout-item-info" style={{ flex: 1, padding: "0 10px" }}>
                  <div className="checkout-item-name" style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{item.name}</div>
                  <div className="checkout-item-qty" style={{ fontSize: "0.75rem", color: "#666" }}>Qty: {item.quantity} × ${item.price}</div>
                </div>
                <div className="checkout-item-price" style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="checkout-total-row" style={{ marginTop: "15px", background: "#f8f9fa", padding: "10px", borderRadius: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="checkout-total-label" style={{ fontWeight: "bold", color: "#333" }}>
              Total Amount
            </span>
            <span className="checkout-total-amount" style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#28a745" }}>
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="razorpay-modal-footer">
          <button className="checkout-cancel-btn" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </button>
          <button
            className="checkout-pay-btn"
            onClick={handleRazorpayPayment}
            disabled={isProcessing || addresses.length === 0 || !selectedAddressId}
            style={{ opacity: (isProcessing || addresses.length === 0 || !selectedAddressId) ? 0.6 : 1 }}
          >
            {isProcessing ? "Processing..." : `Pay $${totalPrice.toLocaleString()} →`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
