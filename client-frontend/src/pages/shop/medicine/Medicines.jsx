import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance.js";
import "./Medicines.css";

const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      setLoadingProducts(true);
      setProductsError(null);
      try {
        const res = await axiosInstance.get("/products?category=medicines");
        setMedicines(res.data);
        setAllMedicines(res.data);
        console.log("Medicines:", res.data);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setProductsError("Failed to load medicines");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchMedicines();
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
    let sortedMeds = [...allMedicines];

    if (sortOption === "bestSales") {
      sortedMeds.sort((a, b) =>
        orderOption === "descending" ? b.sales_count - a.sales_count : a.sales_count - b.sales_count
      );
    } else if (sortOption === "price") {
      sortedMeds.sort((a, b) => {
        let priceA = parseFloat(a.price) || 0;
        let priceB = parseFloat(b.price) || 0;
        return orderOption === "descending" ? priceB - priceA : priceA - priceB;
      });
    } else {
      sortedMeds.sort((a, b) =>
        orderOption === "descending"
          ? a.name < b.name ? 1 : -1
          : a.name > b.name ? 1 : -1
      );
    }

    setMedicines(sortedMeds);
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
        <div id="med-container">
          {medicines.length === 0 ? (
            <p>No medicines found.</p>
          ) : (
            medicines.map((medicine) => {
              // Format the name for URL and display
              const urlName = medicine.name
                .toLowerCase()
                .replace(/\s+/g, "")
                .replace(/[()]/g, "");
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