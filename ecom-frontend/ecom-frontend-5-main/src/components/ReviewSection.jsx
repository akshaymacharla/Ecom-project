import React, { useState, useEffect, useContext } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const StarRating = ({ rating, onRate, interactive = false, size = "1.2rem" }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "inline-flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`bi ${
            star <= (interactive ? hovered || rating : rating)
              ? "bi-star-fill"
              : "bi-star"
          }`}
          style={{
            fontSize: size,
            color: star <= (interactive ? hovered || rating : rating) ? "#ffc107" : "#ddd",
            cursor: interactive ? "pointer" : "default",
            transition: "color 0.15s",
          }}
          onClick={() => interactive && onRate && onRate(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
        />
      ))}
    </div>
  );
};

const ReviewSection = ({ productId }) => {
  const { isLoggedIn, user, addToast } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/reviews/product/${productId}`);
      setReviews(response.data);
      // Check if current user has already reviewed
      if (user) {
        const userReview = response.data.find(
          (r) => r.reviewerId === parseInt(user.userId)
        );
        setHasReviewed(!!userReview);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      addToast("Please select a rating", "warning");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("/reviews", {
        productId: parseInt(productId),
        rating,
        comment,
      });
      addToast("Review submitted successfully!", "success");
      setRating(0);
      setComment("");
      fetchReviews();
    } catch (error) {
      const errMsg = error.response?.data?.message || error.response?.data?.error || "Failed to submit review";
      addToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`/reviews/${reviewId}`);
      addToast("Review deleted", "info");
      fetchReviews();
    } catch (error) {
      addToast("Failed to delete review", "error");
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h4 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
        <i className="bi bi-chat-left-text-fill" style={{ color: "#6366f1" }}></i>
        Reviews & Ratings
        {reviews.length > 0 && (
          <span style={{
            fontSize: "0.85rem",
            background: "#f0f0f0",
            padding: "2px 10px",
            borderRadius: "12px",
            fontWeight: "normal"
          }}>
            {avgRating} ★ · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </span>
        )}
      </h4>

      {/* Review Form */}
      {isLoggedIn && !hasReviewed && (
        <div style={{
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "1.5rem",
          background: "#fafafa",
        }}>
          <h6 style={{ marginBottom: "12px" }}>Write a Review</h6>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontWeight: "500" }}>
                Your Rating
              </label>
              <StarRating rating={rating} onRate={setRating} interactive size="1.5rem" />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <textarea
                className="form-control"
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                style={{ resize: "vertical" }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={submitting || rating === 0}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {isLoggedIn && hasReviewed && (
        <p style={{ color: "#666", fontStyle: "italic", marginBottom: "1rem" }}>
          <i className="bi bi-check-circle-fill" style={{ color: "green" }}></i>{" "}
          You've already reviewed this product.
        </p>
      )}

      {!isLoggedIn && (
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          <a href="/login" style={{ color: "#6366f1" }}>Login</a> to write a review.
        </p>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p style={{ color: "#999" }}>No reviews yet. Be the first to review!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid #eee",
                borderRadius: "8px",
                padding: "14px",
                background: "#fff",
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#6366f1",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}>
                    {review.reviewerName?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.9rem" }}>{review.reviewerName}</strong>
                    <div style={{ fontSize: "0.75rem", color: "#999" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <StarRating rating={review.rating} size="0.9rem" />
                  {user && parseInt(user.userId) === review.reviewerId && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      style={{ padding: "2px 6px", fontSize: "0.75rem" }}
                      onClick={() => handleDelete(review.id)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  )}
                </div>
              </div>
              {review.comment && (
                <p style={{ margin: 0, color: "#444", fontSize: "0.9rem" }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { StarRating };
export default ReviewSection;
