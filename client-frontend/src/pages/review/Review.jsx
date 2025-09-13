import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Review.css";
import download from "../../assets/images/download.png";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopReviews();
  }, []);

  const fetchTopReviews = async () => {
    try {
      setLoading(true);
      const reviewsRes = await axiosInstance.get(
        "/reviews?limit=3"
      );

      // Ensure reviews is always an array
      if (Array.isArray(reviewsRes.data)) {
        setReviews(reviewsRes.data);
      } else if (Array.isArray(reviewsRes.data.reviews)) {
        setReviews(reviewsRes.data.reviews);
      } else if (Array.isArray(reviewsRes.data.data)) {
        setReviews(reviewsRes.data.data);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      setLoading(true);
      // Fetch all reviews ordered by rating in ascending order
      const allReviewsRes = await axiosInstance.get(
        "/reviews?sortBy=rating&sortDirection=asc&all=true"
      );

      // Ensure allReviews is always an array
      if (Array.isArray(allReviewsRes.data)) {
        setAllReviews(allReviewsRes.data);
      } else if (Array.isArray(allReviewsRes.data.reviews)) {
        setAllReviews(allReviewsRes.data.reviews);
      } else if (Array.isArray(allReviewsRes.data.data)) {
        setAllReviews(allReviewsRes.data.data);
      } else {
        setAllReviews([]);
      }
      setShowAllReviews(true);
    } catch (error) {
      console.error("Error fetching all reviews:", error);
      setAllReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    if (!newReview.trim() || !newRating) {
      alert("Please write a review and select a rating.");
      return;
    }
    
    try {
      setLoading(true);
      const res = await axiosInstance.post("/reviews", {
        message: newReview,
        rating: parseInt(newRating),
      });

      // Normalize response in case backend wraps it
      const createdReview = res.data.review || res.data.data || res.data || null;

      if (createdReview) {
        // Update both top reviews and all reviews if showing
        setReviews((prev) => [createdReview, ...prev].slice(0, 3));
        if (showAllReviews) {
          // Insert the new review in the correct position based on rating (ascending order)
          setAllReviews((prev) => {
            const newList = [...prev, createdReview];
            return newList.sort((a, b) => a.rating - b.rating);
          });
        }
      }

      setNewReview("");
      setNewRating("");
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      if (error.response?.status === 401) {
        alert("Please login to submit a review.");
      } else {
        alert("Error submitting review. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToTop = () => {
    setShowAllReviews(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayReviews = showAllReviews ? allReviews : reviews;

  return (
    <div className="review-container">
      <div className="review-header-section">
        <h1>Customer Reviews</h1>
        <p>Share your experience and read what others are saying about Medicure</p>
      </div>

      {/* Review Writing Form */}
      <section className="review-form-section">
        <h2>Write a Review</h2>
        <div className="review-form">
          <textarea
            placeholder="Write your review..."
            className="review-input"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            disabled={loading}
          />

          <div className="review-form-inline">
            <select
              className="review-select"
              value={newRating}
              onChange={(e) => setNewRating(e.target.value)}
              disabled={loading}
            >
              <option value="">Select Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
              <option value="4">⭐⭐⭐⭐ - Good</option>
              <option value="3">⭐⭐⭐ - Average</option>
              <option value="2">⭐⭐ - Poor</option>
              <option value="1">⭐ - Terrible</option>
            </select>

            <button 
              className="review-submit" 
              onClick={handleReviewSubmit}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Display */}
      <section className="reviews-display-section">
        <div className="reviews-header">
          <h2>{showAllReviews ? "All Reviews " : "Top Reviews"}</h2>
          {!showAllReviews && (
            <button 
              className="view-all-button"
              onClick={fetchAllReviews}
              disabled={loading}
            >
              {loading ? "Loading..." : "View All Reviews"}
            </button>
          )}
          {showAllReviews && (
            <button 
              className="back-to-top-button"
              onClick={handleBackToTop}
            >
              Back to Top Reviews
            </button>
          )}
        </div>

        <div className="review-row">
          {loading ? (
            <div className="loading-message">Loading reviews...</div>
          ) : displayReviews.length > 0 ? (
            displayReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <img
                    src={review.user?.profile_image_url || download}
                    alt={review.user?.name || "User"}
                    className="review-avatar"
                  />
                  <div>
                    <h4>{review.user?.name || "Anonymous"}</h4>
                    <div className="review-stars">
                      {"⭐".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <div className="review-date">
                      {new Date(review.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="review-text">{review.message}</p>
              </div>
            ))
          ) : (
            <div className="no-reviews-message">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Review;