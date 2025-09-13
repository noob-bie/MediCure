import React, { useState, useEffect } from "react";
import Slide from "../../components/slide/Slide";
import axiosInstance from "../../utils/axiosInstance";
import "./Home.css";
import { Link } from "react-router-dom";
import download from "../../assets/images/download.png";

const Home = () => {
  const [bestSales, setBestSales] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState("");

  useEffect(() => {
    const fetchProductsAndReviews = async () => {
      try {
        // Fetch top 4 products by sales_count
        const salesRes = await axiosInstance.get(
          "/products?sortBy=sales_count&sortDirection=desc&limit=4"
        );
        setBestSales(salesRes.data);

        // Fetch top 4 latest products
        const latestRes = await axiosInstance.get(
          "/products?sortBy=created_at&sortDirection=desc&limit=4"
        );
        setLatestProducts(latestRes.data);

        // Fetch latest 4 reviews
        const reviewsRes = await axiosInstance.get(
          "/reviews?sortBy=created_at&sortDirection=desc&limit=3"
        );

        // ✅ Ensure reviews is always an array
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
        console.error("Error fetching data:", error);
      }
    };
    fetchProductsAndReviews();
  }, []);

  const handleReviewSubmit = async () => {
    if (!newReview.trim() || !newRating) {
      alert("Please write a review and select a rating.");
      return;
    }
    try {
      const res = await axiosInstance.post("/reviews", {
        message: newReview,
        rating: parseInt(newRating),
      });

      // ✅ Normalize response in case backend wraps it
      const createdReview =
        res.data.review || res.data.data || res.data || null;

      if (createdReview) {
        setReviews((prev) => [createdReview, ...prev].slice(0, 3));
      }

      setNewReview("");
      setNewRating("");
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="home-container">
      <Slide />

      <div className="content">
        <h2>Welcome to Medicure</h2>
        <p>Your trusted online pharmacy.</p>
        <p>
          At Medicure, we make healthcare accessible, affordable, and reliable.
          Explore our range of trusted medicines, wellness products, and health
          solutions tailored to your needs. Whether managing chronic conditions
          or looking for everyday essentials, we’re here to prioritize your
          health with care and convenience.
        </p>
      </div>

      {/* Best Sales */}
      <section className="mt-5">
        <h2 className="text-center">Best Sales</h2>
        <div className="product-row">
          {bestSales.length > 0 ? (
            bestSales.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="goods-card"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="goods-image"
                />
                <h3>{product.name}</h3>
                <h4 className="text-muted">{product.category}</h4>
                <p className="text-primary fw-bold">৳{product.price}</p>
              </Link>
            ))
          ) : (
            <p>No best sales products available.</p>
          )}
        </div>
      </section>

      {/* Latest Products */}
      <section className="mt-5">
        <h2 className="text-center">Latest Products</h2>
        <div className="product-row">
          {latestProducts.length > 0 ? (
            latestProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="goods-card"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="goods-image"
                />
                <h3>{product.name}</h3>
                <h4 className="text-muted">{product.category}</h4>
                <p className="text-primary fw-bold">৳{product.price}</p>
              </Link>
            ))
          ) : (
            <p>No latest products available.</p>
          )}
        </div>
      </section>

     {/* Action Buttons Section */}
      <section className="mt-5 mb-5">
        <div className="action-buttons-container">
          <Link to="/contact" className="action-button contact-button">
            <div className="button-icon">📞</div>
            <h3>Contact Us</h3>
            <p>Get in touch with our support team</p>
          </Link>
          
          <Link to="/reviews" className="action-button review-button">
            <div className="button-icon">⭐</div>
            <h3>Rate Us</h3>
            <p>Share your experience with us</p>
          </Link>
          
          <Link to="/about" className="action-button about-button">
            <div className="button-icon">ℹ️</div>
            <h3>About Us</h3>
            <p>Learn more about Medicure</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
