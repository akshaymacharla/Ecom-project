import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import axios from "../axios";

const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist,
    moveToCartFromWishlist,
    isLoggedIn,
  } = useContext(AppContext);
  const [wishlistImages, setWishlistImages] = useState({});

  // Fetch images for wishlist items
  useEffect(() => {
    const fetchImages = async () => {
      const images = { ...wishlistImages };
      for (const product of wishlist) {
        if (!images[product.id]) {
          try {
            const response = await axios.get(`/product/${product.id}/image`, {
              responseType: "blob",
            });
            images[product.id] = URL.createObjectURL(response.data);
          } catch (error) {
            images[product.id] = "placeholder-image-url";
          }
        }
      }
      setWishlistImages(images);
    };

    if (wishlist.length > 0) {
      fetchImages();
    }
  }, [wishlist]);

  if (!isLoggedIn) {
    return (
      <div className="wishlist-container" style={{ marginTop: "80px", padding: "20px" }}>
        <div className="wishlist-content" style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
          padding: "3rem"
        }}>
          <i className="bi bi-heart" style={{ fontSize: "3rem", color: "#999" }}></i>
          <h4 style={{ marginTop: "1rem" }}>Please login to view your wishlist</h4>
          <a href="/login" className="btn btn-primary mt-3">Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-container" style={{ marginTop: "80px", padding: "20px" }}>
      <div className="wishlist-content" style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="bi bi-heart-fill" style={{ color: "#dc3545" }}></i>
          My Wishlist
          <span style={{
            fontSize: "0.9rem",
            background: "#f0f0f0",
            padding: "2px 10px",
            borderRadius: "12px",
            fontWeight: "normal"
          }}>
            {wishlist.length} item{wishlist.length !== 1 ? "s" : ""}
          </span>
        </h2>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem" }}>
            <i className="bi bi-heart" style={{ fontSize: "3rem", color: "#ccc" }}></i>
            <h4 style={{ marginTop: "1rem", color: "#666" }}>Your wishlist is empty</h4>
            <p style={{ color: "#999" }}>Start adding products you love!</p>
            <Link to="/" className="btn btn-primary mt-2">Browse Products</Link>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
          }}>
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="card"
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <Link to={`/product/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img
                    src={wishlistImages[product.id] || ""}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      padding: "5px",
                      borderRadius: "10px 10px 0 0",
                    }}
                  />
                </Link>
                <div className="card-body" style={{ padding: "12px" }}>
                  <h6 style={{ fontWeight: "600", margin: "0 0 4px" }}>
                    {product.name?.toUpperCase()}
                  </h6>
                  <p style={{ fontStyle: "italic", fontSize: "0.8rem", margin: "0 0 6px", color: "#666" }}>
                    {product.brand}
                  </p>
                  <p style={{ fontWeight: "bold", fontSize: "1.1rem", margin: "0 0 10px" }}>
                    <i className="bi bi-currency-rupee"></i>{product.price}
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      className="btn btn-sm btn-primary"
                      style={{ flex: 1 }}
                      onClick={() => moveToCartFromWishlist(product.id)}
                      disabled={!product.productAvailable}
                    >
                      <i className="bi bi-cart-plus me-1"></i>
                      {product.productAvailable ? "Move to Cart" : "Out of Stock"}
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
