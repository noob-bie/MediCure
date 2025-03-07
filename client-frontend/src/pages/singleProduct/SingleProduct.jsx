import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./SingleProduct.css"; // Import CSS file
import axiosInstance from "../../utils/axiosInstance";

const SingleProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
