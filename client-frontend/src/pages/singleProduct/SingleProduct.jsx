import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SingleProduct.css";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SingleProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

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

    if (loading) {
        return <h2 className="loading">Loading product details...</h2>;
    }

    if (error || !product) {
        return <h2 className="not-loading">Product Not Found</h2>;
    }

    const handleAddToCart = async () => {
        try {
            const response = await axiosInstance.post("/cart/items", {
                product_id: product.id,
                quantity: 1, // Default quantity is 1
            });
            console.log("Product added to cart:", response.data);
            alert("Product added to cart successfully!"); // Simple success feedback
        } catch (err) {
            console.error("Error adding product to cart:", err);
            alert("Failed to add product to cart. Please try again."); // Simple error feedback
        }
    };

    const handleCheckout = () => {
        navigate("/checkout"); // Navigate to checkout page
        console.log("Checkout clicked for product ID:", product.id);
        // In a real application, you might want to redirect to the checkout page
        // or initiate the checkout process here.
    };

    return (
        <div className="single-product-container">
            <div className="product-card">
                {/* Left Side: Name, Image, Price, Category, Description */}
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

                {/* Right Side: Additional Details */}
                <div className="product-details">
                    {/* Conditionally render nullable attributes */}
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
                    {Object.keys(product).map((key) => {
                        const excludedKeys = [
                            "id",
                            "name",
                            "image",
                            "price",
                            "category",
                            "description",
                            "manufacturer",
                            "expiration_date",
                            "generic_name",
                            "dosage",
                            "indications",
                            "contraindications",
                            "brand",
                            "unit",
                            "created_at",
                            "updated_at",
                        ];
                        if (!excludedKeys.includes(key) && product[key]) {
                            let displayLabel = key
                                .replace(/_/g, " ")
                                .replace(/([a-z])([A-Z])/g, "$1 $2")
                                .toUpperCase();
                            return (
                                <p key={key} className="product-detail-item">
                                    <strong>{displayLabel}:</strong> {product[key]}
                                </p>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Buttons Container */}
                <div className="product-actions">
                    <button className="add-to-cart-button" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                    <button className="checkout-button" onClick={handleCheckout}>
                        Checkout
                    </button>
                </div>
            </div>

        </div>
    );
};

export default SingleProduct;
