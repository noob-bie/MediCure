import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./UpdateProduct.css";

const UpdateProduct = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login as admin to access this page");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
      setAllProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    if (
      (selectedOption === "price" || selectedOption === "bestSales") &&
      !orderOption
    ) {
      return;
    }

    applySortingAndOrdering(selectedOption, orderOption);
  };

  const handleOrderChange = (e) => {
    const selectedOption = e.target.value;
    setOrderOption(selectedOption);

    if (!sortOption) return;

    applySortingAndOrdering(sortOption, selectedOption);
  };

  // Function to apply sorting based on current options
  const applySortingAndOrdering = (sortOption, orderOption) => {
    let sortedProducts = [...allProducts];

    if (sortOption === "bestSales") {
      sortedProducts.sort((a, b) =>
        orderOption === "descending"
          ? b.sales_count - a.sales_count
          : a.sales_count - b.sales_count
      );
    } else if (sortOption === "price") {
      sortedProducts.sort((a, b) => {
        let priceA = parseFloat(a.price) || 0;
        let priceB = parseFloat(b.price) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });
    } else {
      sortedProducts.sort((a, b) =>
        orderOption === "descending"
          ? a.name < b.name
            ? 1
            : -1
          : a.name > b.name
          ? 1
          : -1
      );
    }

    setProducts(sortedProducts);
  };

  if (loading) {
    return (
      <div className="update-product-container">
        <div className="update-content">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="update-product-container">
        <div className="update-content">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="update-product-container">
      <div className="update-content">
        <h2>Update Products</h2>
        <p>
          Click on any product name to edit its details. Here admin can update
          product information.
        </p>
      </div>

      {/* Dropdowns for sorting */}
      <div className="update-dropdown-container">
        <div className="update-sort-container">
          <label htmlFor="sort" className="update-sort-label">
            Sort by:
          </label>
          <select
            id="sort"
            className="update-sort-dropdown"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="">Select</option>
            <option value="bestSales">Best Sales</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="update-order-container">
          <label htmlFor="order" className="update-order-label">
            Order by:
          </label>
          <select
            id="order"
            className="update-order-dropdown"
            value={orderOption}
            onChange={handleOrderChange}
          >
            <option value="">Select</option>
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

      <div className="update-goods-container">
        <strong>Products Available for Update ({products.length})</strong>
      </div>

      <section className="mt-5">
        <div id="update-goods-container">
          {products.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            products.map((product) => (
              <div key={product.id} className="update-goods-card">
                <img
                  src={product.image ? product.image : "default-image.jpg"}
                  alt={product.name}
                  className="update-goods-image"
                />
                <div className="update-goods-info">
                  <h3>
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                  </h3>
                  <p>{product.category}</p>
                  <h4>
                    ৳
                    {product.price
                      ? parseFloat(product.price).toFixed(2)
                      : "N/A"}
                  </h4>
                  <div className="product-stats">
                    <span className="stock-info">
                      Stock: {product.stock_quantity}
                    </span>
                    <span className="sales-info">
                      Sales: {product.sales_count}
                    </span>
                  </div>
                  <div className="update-badge">
                    <Link
                      to={`/admin/product-management/UpdateSingleProduct/${product.id}`}
                    >
                      {" "}
                      {/* UPDATED: Added Link to Single Product Update page */}
                      Click to Update
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default UpdateProduct;