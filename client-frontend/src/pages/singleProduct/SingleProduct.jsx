import React from "react";
import { useParams } from "react-router-dom";
import "./SingleProduct.css";
import axiosInstance from "../../utils/axiosInstance";
import { useState, useEffect } from "react";

const SingleProduct = () => {
  const { productName, id  } = useParams();
  const decodedProductName = decodeURIComponent(productName);
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  useEffect(() => {
    fetchProductDetails();
  }, [id]);
  

  const fetchProductDetails = async () => {
    setLoading(true);

    setError(null);

    try {
      const response = await axiosInstance.get(`/products/${id}`);

      setProduct(response.data.product);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching product details:", err);

      setError(err);

      setLoading(false);
    }
  };

  if (loading) {
    return <h2 className="loading">Loading product details...</h2>;
  }

  if (error || !product) {
    return <h2 className="not-loading">Product Not Found</h2>;
  }

  return (
    <div className="single-product-container">
      <div className="product-card">
        <div className="product-image-area">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <div className="product-description-container">
            <h2 className="description-title">Product Description:</h2>
            <p className="full-description">
              {product.description || "No description available."}
            </p>
          </div>
        </div>
        <div className="product-details">
          <h2 className="product-name">{product.name}</h2>
          {product.generic_name && (
            <h4 className="generic-name">
              Generic Name: {product.generic_name}
            </h4>
          )}
          <h3 className="product-price">Price: ${product.price.toFixed(2)}</h3>
          <h4 className="stock">Stock: {product.stock_quantity} units</h4>
          {product.manufacturer && (
            <h4 className="manufacturer">
              Manufacturer: {product.manufacturer}
            </h4>
          )}
          {product.expiration_date && (
            <h4 className="expiry">Expiry Date: {product.expiration_date}</h4>
          )}
          <div className="buy-button-container">
            <button className="buy-button">Buy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
