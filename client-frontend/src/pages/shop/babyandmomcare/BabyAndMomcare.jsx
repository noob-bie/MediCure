import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance.js";
import "./BabyAndMomcare.css";

const BabyAndMomcare = () => {
  const [babyMomProducts, setBabyMomProducts] = useState([]);
  const [allBabyMomProducts, setAllBabyMomProducts] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    const fetchBabyMomProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        // Fix: Properly encode the category parameter with & symbol
        const categoryParam = encodeURIComponent("Baby & Mom Care");
        const res = await axiosInstance.get(`/products?category=${categoryParam}`);
        setBabyMomProducts(res.data);
        setAllBabyMomProducts(res.data);
        console.log("Baby & Mom Care products:", res.data);
      } catch (err) {
        console.error("Error fetching baby & mom care products:", err);
        setProductsError("Failed to load baby & mom care products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchBabyMomProducts();
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
    let sortedBabyMom = [...allBabyMomProducts];

    if (sortOption === "bestSales") {
      sortedBabyMom.sort((a, b) =>
        orderOption === "descending" ? b.sales_count - a.sales_count : a.sales_count - b.sales_count
      );
    } else if (sortOption === "price") {
      sortedBabyMom.sort((a, b) => {
        let priceA = parseFloat(a.price) || 0;
        let priceB = parseFloat(b.price) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });
    } else {
      sortedBabyMom.sort((a, b) =>
        orderOption === "descending"
          ? a.name < b.name ? 1 : -1
          : a.name > b.name ? 1 : -1
      );
    }

    setBabyMomProducts(sortedBabyMom);
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
        <div id="babyANDmom_Products-container">
          {babyMomProducts.length === 0 ? (
            <p>No baby & mom care products found.</p>
          ) : (
            babyMomProducts.map((product) => {
              // Format the name for URL and display
              const urlName = product.name
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[()]/g, "");
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