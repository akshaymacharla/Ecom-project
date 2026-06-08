import React, { useContext, useState, useEffect } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import CheckoutPopup from "./CheckoutPopup";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity, clearCart, fetchCart, isLoggedIn, addToast } =
    useContext(AppContext);
  const [cartImages, setCartImages] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch images for cart items
  useEffect(() => {
    const fetchImages = async () => {
      const images = { ...cartImages };
      for (const item of cart) {
        if (!images[item.product.id]) {
          try {
            const response = await axios.get(
              `/product/${item.product.id}/image`,
              { responseType: "blob" }
            );
            images[item.product.id] = URL.createObjectURL(response.data);
          } catch (error) {
            images[item.product.id] = "placeholder-image-url";
          }
        }
      }
      setCartImages(images);
    };

    if (cart.length > 0) {
      fetchImages();
    }
  }, [cart]);

  // Calculate total price
  useEffect(() => {
    const total = cart.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [cart]);

  const handleIncreaseQuantity = (item) => {
    if (item.quantity < item.product.stockQuantity) {
      updateCartQuantity(item.product.id, item.quantity + 1);
    } else {
      addToast("Cannot add more than available stock", "warning");
    }
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateCartQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  // Build cartItems with images for CheckoutPopup compatibility
  const cartItemsForCheckout = cart.map((item) => ({
    id: item.product.id,
    name: item.product.name,
    brand: item.product.brand,
    price: item.product.price,
    quantity: item.quantity,
    stockQuantity: item.product.stockQuantity,
    imageUrl: cartImages[item.product.id] || "",
  }));

  const handleCheckout = async (shippingAddress) => {
    try {
      const orderRequest = {
        items: null, // Let backend build it from the cart
        shippingAddress: shippingAddress,
      };
      const response = await axios.post("/orders", orderRequest);
      console.log("Order placed successfully:", response.data);
      
      await fetchCart(); // Refresh cart (should be empty now)
      setShowModal(false);
      navigate("/orders"); // Redirect to order history
    } catch (error) {
      console.error("Error during checkout:", error);
      addToast(error.response?.data?.error || "Failed to place order", "error");
      throw error; // Let the popup know it failed
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="cart-container">
        <div className="shopping-cart">
          <div className="title">Shopping Bag</div>
          <div className="empty" style={{ textAlign: "center", padding: "3rem" }}>
            <i className="bi bi-cart-x" style={{ fontSize: "3rem", color: "#999" }}></i>
            <h4 style={{ marginTop: "1rem" }}>Please login to view your cart</h4>
            <a href="/login" className="btn btn-primary mt-3">
              Login
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="shopping-cart">
        <div className="title">Shopping Bag</div>
        {cart.length === 0 ? (
          <div className="empty" style={{ textAlign: "left", padding: "2rem" }}>
            <h4>Your cart is empty</h4>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <div
                  className="item"
                  style={{ display: "flex", alignContent: "center" }}
                >
                  <div>
                    <img
                      src={cartImages[item.product.id] || ""}
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                  </div>
                  <div className="description">
                    <span>{item.product.brand}</span>
                    <span>{item.product.name}</span>
                  </div>

                  <div className="quantity">
                    <button
                      className="plus-btn"
                      type="button"
                      onClick={() => handleIncreaseQuantity(item)}
                    >
                      <i className="bi bi-plus-square-fill"></i>
                    </button>
                    <input
                      type="button"
                      name="name"
                      value={item.quantity}
                      readOnly
                    />
                    <button
                      className="minus-btn"
                      type="button"
                      onClick={() => handleDecreaseQuantity(item)}
                    >
                      <i className="bi bi-dash-square-fill"></i>
                    </button>
                  </div>

                  <div className="total-price" style={{ textAlign: "center" }}>
                    ${item.product.price * item.quantity}
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(item.product.id)}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </li>
            ))}
            <div className="total">Total: ${totalPrice}</div>
            <Button
              className="btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => setShowModal(true)}
            >
              Checkout
            </Button>
          </>
        )}
      </div>
      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItemsForCheckout}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
