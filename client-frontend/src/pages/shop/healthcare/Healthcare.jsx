import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance.js";
import "./Healthcare.css";

const Healthcare = () => {
  const [healthcare, setHealthcare] = useState([]);
  const [allHealthcare, setAllHealthcare] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    const fetchHealthcareProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        const res = await axiosInstance.get("/products?category=healthcare");
        setHealthcare(res.data);
        setAllHealthcare(res.data);
        console.log("Healthcare products:", res.data);
      } catch (err) {
        console.error("Error fetching healthcare products:", err);
        setProductsError("Failed to load healthcare products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchHealthcareProducts();
  }, []);

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    // If sorting by price or best sales, wait for order selection
    if ((selectedOption === "price" || selectedOption === "bestSales") && !orderOption) {
      return;
    }

    applySortingAndOrdering(selectedOption, orderOption);
  };

  const handleOrderChange = (e) => {
    const selectedOption = e.target.value;
    setOrderOption(selectedOption);

    // If no sort option is selected, do nothing
    if (!sortOption) return;

    applySortingAndOrdering(sortOption, selectedOption);
  };

  // Function to apply sorting based on current options
  const applySortingAndOrdering = (sortOption, orderOption) => {
    let sortedHealthcare = [...allHealthcare];

    if (sortOption === "bestSales") {
      sortedHealthcare.sort((a, b) =>
        orderOption === "descending" ? b.sales_count - a.sales_count : a.sales_count - b.sales_count
      );
    } else if (sortOption === "price") {
      sortedHealthcare.sort((a, b) => {
        let priceA = parseFloat(a.price) || 0;
        let priceB = parseFloat(b.price) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });
    } else {
      sortedHealthcare.sort((a, b) =>
        orderOption === "descending"
          ? a.name < b.name ? 1 : -1
          : a.name > b.name ? 1 : -1
      );
    }

    setHealthcare(sortedHealthcare);
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
            <option value="bestSales">Best Sales</option>
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
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>
      </div>

      <section className="mt-5">
        <div id="healthcare_Products-container">
          {healthcare.length === 0 ? (
            <p>No healthcare products found.</p>
          ) : (
            healthcare.map((product) => {
              // Format the name for URL and display
              const urlName = product.name
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[()]/g, "");
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
                    {product.brand && <p>Brand: {product.brand}</p>}
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