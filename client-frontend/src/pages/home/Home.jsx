import React, { useState, useEffect } from "react";
import Slide from "../../components/slide/Slide";
import axiosInstance from "../../utils/axiosInstance";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const [bestSales, setBestSales] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch top 4 products by sales_count
        const salesRes = await axiosInstance.get(
          "/products?sortBy=sales_count&sortDirection=desc&limit=4"
        );
        setBestSales(salesRes.data);

        // Fetch top 4 latest products by created_at
        const latestRes = await axiosInstance.get(
          "/products?sortBy=created_at&sortDirection=desc&limit=4"
        );
        setLatestProducts(latestRes.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

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
                to={`/product/${product.id}`} // ✅ FIXED
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
                to={`/product/${product.id}`} // ✅ FIXED
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
    </div>
  );
};

export default Home;
