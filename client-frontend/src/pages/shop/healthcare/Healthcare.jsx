import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance.js";
import "./Healthcare.css";

const Healthcare = () => {
  const [healthcare, setHealthcare] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // Fetch healthcare products with sorting
  const fetchHealthcareProducts = async (sortBy = null, sortDirection = 'asc') => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      let apiUrl = "/products?category=healthcare";
      
      // Add sorting parameters if provided
      if (sortBy && sortDirection) {
        apiUrl += `&sortBy=${sortBy}&sortDirection=${sortDirection}`;
      }
      
      console.log("Healthcare API URL:", apiUrl);
      const res = await axiosInstance.get(apiUrl);
      setHealthcare(res.data);
      console.log("Healthcare products:", res.data);
    } catch (err) {
      console.error("Error fetching healthcare products:", err);
      setProductsError("Failed to load healthcare products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchHealthcareProducts();
  }, []);

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    // Reset order option when sort changes
    if (selectedOption === "") {
      setOrderOption("");
      fetchHealthcareProducts(); // Fetch without sorting
      return;
    }

    // If we have an order option, apply sorting immediately
    if (orderOption) {
      fetchHealthcareProducts(selectedOption, orderOption);
    }
  };

  const handleOrderChange = (e) => {
    const selectedOption = e.target.value;
    setOrderOption(selectedOption);

    // If we have a sort option, apply sorting
    if (sortOption && selectedOption) {
      fetchHealthcareProducts(sortOption, selectedOption);
    } else if (selectedOption === "") {
      // If order is cleared, fetch without sorting
      setSortOption("");
      fetchHealthcareProducts();
    }
  };

  if (loadingProducts) {
    return (
      <div className="Healthcare-container">
        <p>Loading healthcare products...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="Healthcare-container">
        <p>Error: {productsError}</p>
      </div>
    );
  }

  return (
    <div className="Healthcare-container">
      {/* Dropdowns for sorting */}
      <div className="dropdown-container">
        <div className="sort-container">
          <label htmlFor="sort" className="sort-label">
            Sort by:
          </label>
          <select
            id="sort"
            className="sort-dropdown"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="">Select</option>
            <option value="sales_count">Best Sales</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div className="order-container">
          <label htmlFor="order" className="order-label">
            Order by:
          </label>
          <select
            id="order"
            className="order-dropdown"
            value={orderOption}
            onChange={handleOrderChange}
          >
            <option value="">Select</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <section className="mt-5">
        <div id="healthcare_Products-container">
          {healthcare.length === 0 ? (
            <p>No healthcare products found.</p>
          ) : (
            healthcare.map((product) => {
              const displayName = product.name;

              return (
                <div key={product.id} className="healthcare_Products-card">
                  <img
                    src={product.image || "default-image.jpg"}
                    alt={product.name}
                    className="healthcare_Products-image"
                  />
                  <div className="healthcare_Products-info">
                    <h3>
                      <Link to={`/product/${product.id}`}>{displayName}</Link>
                    </h3>
                    {product.manufacturer && <p>Manufacturer: {product.manufacturer}</p>}
                    <h4>৳{parseFloat(product.price).toFixed(2)}</h4>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default Healthcare;