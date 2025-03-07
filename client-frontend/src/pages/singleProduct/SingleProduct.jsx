import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SingleProduct.css"; // Import CSS file
import axiosInstance from "../../utils/axiosInstance";

const SingleProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log("Fetching product with ID:", id);
                const response = await axiosInstance.get(`/products/${id}`);
                console.log("Single Product API Response Data:", response.data);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        setAddingToCart(true);
        try {
            await axiosInstance.post("/cart/items", {
                product_id: product.id,
                quantity: 1, // Default quantity is 1
            });
            alert("Product added to cart successfully!");
        } catch (error) {
            console.error("Error adding product to cart:", error);
            alert("Failed to add product to cart.");
        }
        setAddingToCart(false);
    };

    const handleBuyNow = () => {
        if (!product) return;
        handleAddToCart(); // Add product to cart first
        navigate("/checkout"); // Redirect to checkout page
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
                {/* Left Side: Name, Image, Price, Category, Description */}
                <div className="product-info">
                    <h1 className="product-name">{product.name}</h1>
                    {product.image && (
                        <img src={product.image} alt={product.name} className="product-image" />
                    )}
                    <h4 className="product-price">Price: ৳{product.price}</h4>
                    <p className="product-category">Category: {product.category}</p>
                    <p className="product-description">{product.description}</p>

                    {/* Add to Cart & Buy Now Buttons */}
                    <div className="product-actions">
                        <button 
                            className="add-to-cart-btn" 
                            onClick={handleAddToCart} 
                            disabled={addingToCart}
                        >
                            {addingToCart ? "Adding..." : "Add to Cart"}
                        </button>
                        <button className="buy-now-btn" onClick={handleBuyNow}>
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Right Side: Additional Details */}
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
            </div>
        </div>
    );
};

export default SingleProduct;
