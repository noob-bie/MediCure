import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance.js";
import "./Medicines.css";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // Fetch medicines with sorting
  const fetchMedicines = async (sortBy = null, sortDirection = 'asc') => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      let apiUrl = "/products?category=medicines";
      
      // Add sorting parameters if provided
      if (sortBy && sortDirection) {
        apiUrl += `&sortBy=${sortBy}&sortDirection=${sortDirection}`;
      }
      
      console.log("Medicines API URL:", apiUrl);
      const res = await axiosInstance.get(apiUrl);
      setMedicines(res.data);
      console.log("Medicines:", res.data);
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setProductsError("Failed to load medicines");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Handle sort option change
  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);

    // Reset order option when sort changes
    if (selectedOption === "") {
      setOrderOption("");
      fetchMedicines(); // Fetch without sorting
      return;
    }

    // If we have an order option, apply sorting immediately
    if (orderOption) {
      fetchMedicines(selectedOption, orderOption);
    }
  };

  const handleOrderChange = (e) => {
    const selectedOption = e.target.value;
    setOrderOption(selectedOption);

    // If we have a sort option, apply sorting
    if (sortOption && selectedOption) {
      fetchMedicines(sortOption, selectedOption);
    } else if (selectedOption === "") {
      // If order is cleared, fetch without sorting
      setSortOption("");
      fetchMedicines();
    }
  };

  if (loadingProducts) {
    return (
      <div className="Medicine-container">
        <p>Loading medicines...</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="Medicine-container">
        <p>Error: {productsError}</p>
      </div>
    );
  }

  return (
    <div className="Medicine-container">
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
        <div id="med-container">
          {medicines.length === 0 ? (
            <p>No medicines found.</p>
          ) : (
            medicines.map((medicine) => {
              const displayName = medicine.name;

              return (
                <div key={medicine.id} className="med-card">
                  <img
                    src={medicine.image || "default-image.jpg"}
                    alt={medicine.name}
                    className="med-image"
                  />
                  <div className="med-info">
                    <h3>
                      <Link to={`/product/${medicine.id}`}>{displayName}</Link>
                    </h3>
                    {medicine.generic_name && <p>{medicine.generic_name}</p>}
                    {medicine.dosage && <p>Dosage: {medicine.dosage}</p>}
                    <h4>৳{parseFloat(medicine.price).toFixed(2)}</h4>
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

export default Medicines;