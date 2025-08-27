import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SingleProduct.css";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const SingleProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) return <h2 className="loading">Loading product details...</h2>;
  if (error || !product)
    return <h2 className="not-loading">Product Not Found</h2>;

  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post("/cart/items", {
        product_id: product.id,
        quantity: 1,
      });
      setPopupMessage("Product added to cart successfully!");
      setIsError(false);
    } catch (err) {
      setPopupMessage("Failed to add product to cart. Please try again.");
      setIsError(true);
    }
  };

  const handleCheckout = () => {
    const selectedCartItems = [
      {
        id: `temp_${product.id}`,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
        quantity: 1,
      },
    ];

    navigate("/checkout", {
      state: { selectedCartItems, fromSingleProduct: true },
    });
  };

  const handleClosePopup = () => {
    setPopupMessage(null);
  };

  return (
    <div className="single-product-container">
      <div className="product-card">
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
          )}
          <h4 className="product-price">Price: ৳{product.price}</h4>
          <p className="product-category">Category: {product.category}</p>
          <p className="product-description">{product.description}</p>
        </div>

        <div className="product-details">
          {product.manufacturer && (
            <p className="product-detail-item">
              <strong>Manufacturer:</strong> {product.manufacturer}
            </p>
          )}
          {product.expiration_date && (
            <p className="product-detail-item">
              <strong>Expiration Date:</strong> {product.expiration_date}
            </p>
          )}
          {product.generic_name && (
            <p className="product-detail-item">
              <strong>Generic Name:</strong> {product.generic_name}
            </p>
          )}
          {product.dosage && (
            <p className="product-detail-item">
              <strong>Dosage:</strong> {product.dosage}
            </p>
          )}
          {product.indications && (
            <p className="product-detail-item">
              <strong>Indications:</strong> {product.indications}
            </p>
          )}
          {product.contraindications && (
            <p className="product-detail-item">
              <strong>Contraindications:</strong> {product.contraindications}
            </p>
          )}
          {product.brand && (
            <p className="product-detail-item">
              <strong>Brand:</strong> {product.brand}
            </p>
          )}
          {product.unit && (
            <p className="product-detail-item">
              <strong>Unit:</strong> {product.unit}
            </p>
          )}
        </div>

        <div className="product-actions">
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="checkout-button" onClick={handleCheckout}>
            Checkout
          </button>
        </div>
      </div>

      {/* Popup */}
      {popupMessage && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p className={isError ? "error-message" : "success-message"}>
              {popupMessage}
            </p>
            <button onClick={handleClosePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
