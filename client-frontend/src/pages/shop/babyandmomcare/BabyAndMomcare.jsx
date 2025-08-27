import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance.js";
import "./BabyAndMomcare.css";

const BabyAndMomcare = () => {
  const [babyMomProducts, setBabyMomProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // Fetch baby & mom care products with sorting
  const fetchBabyMomProducts = async (sortBy = null, sortDirection = 'asc') => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      // Fix: Properly encode the category parameter with & symbol
      const categoryParam = encodeURIComponent("Baby & Mom Care");
      let apiUrl = `/products?category=${categoryParam}`;
      
      // Add sorting parameters if provided
      if (sortBy && sortDirection) {
        apiUrl += `&sortBy=${sortBy}&sortDirection=${sortDirection}`;
      }
      
      console.log("Baby & Mom Care API URL:", apiUrl);
      const res = await axiosInstance.get(apiUrl);
      setBabyMomProducts(res.data);
      console.log("Baby & Mom Care products:", res.data);
    } catch (err) {
      console.error("Error fetching baby & mom care products:", err);
      setProductsError("Failed to load baby & mom care products");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchBabyMomProducts();
  }, []);

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    // Reset order option when sort changes
    if (selectedOption === "") {
      setOrderOption("");
      fetchBabyMomProducts(); // Fetch without sorting
      return;
    }

    // If we have an order option, apply sorting immediately
    if (orderOption) {
      fetchBabyMomProducts(selectedOption, orderOption);
    }
  };

  const handleOrderChange = (e) => {
    const selectedOption = e.target.value;
    setOrderOption(selectedOption);

    // If we have a sort option, apply sorting
    if (sortOption && selectedOption) {
      fetchBabyMomProducts(sortOption, selectedOption);
    } else if (selectedOption === "") {
      // If order is cleared, fetch without sorting
      setSortOption("");
      fetchBabyMomProducts();
    }
  };

  if (loadingProducts) {
    return (
      <div className="Homecare-container">
        <p>Loading baby & mom care products...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="Homecare-container">
        <p>Error: {productsError}</p>
      </div>
    );
  }

  return (
    <div className="Homecare-container">
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
        <div id="babyANDmom_Products-container">
          {babyMomProducts.length === 0 ? (
            <p>No baby & mom care products found.</p>
          ) : (
            babyMomProducts.map((product) => {
              const displayName = product.name;

              return (
                <div key={product.id} className="babyANDmom_Products-card">
                  <img
                    src={product.image || "default-image.jpg"}
                    alt={product.name}
                    className="babyANDmom_Products-image"
                  />
                  <div className="babyANDmom_Products-info">
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

export default BabyAndMomcare;