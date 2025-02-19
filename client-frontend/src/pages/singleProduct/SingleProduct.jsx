import React from "react";
import { useParams } from "react-router-dom";
import { goods } from "../shop/Shop"; // Ensure correct path
import "./SingleProduct.css";

const SingleProduct = () => {
  const { productName } = useParams();
  const decodedProductName = decodeURIComponent(productName);

  // Find the product by matching the name
  const product = goods.find(
    (item) =>
      item.name.toLowerCase().replace(/\s+/g, "").replace(/_/g, "") ===
      decodedProductName.toLowerCase()
  );

  if (!product) {
    return <h2 className="not-found">Product Not Found</h2>;
  }

  return (
    <div className="single-product-container">
      <div className="product-card">
        {/* Product Image */}
        <div className="product-image-area">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <div className="product-description-container">
            <h2 className="description-title">Product Description:</h2>
            <p className="full-description">
              Data will be fetched{product.description}
            </p>
          </div>
        </div>
        {/* Product Details */}
        <div className="product-details">
          <h2 className="product-name">{product.name}</h2>
          <h4 className="generic-name">{product.Generic_Name}</h4>
          <h3 className="product-price">Price: {product.price}</h3>

          {/* Buy Button (Moved to Right) */}
          <div className="buy-button-container">
            <button className="buy-button">Buy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
