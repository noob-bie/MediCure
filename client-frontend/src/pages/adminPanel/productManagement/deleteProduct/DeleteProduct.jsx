import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DeleteProduct.css";

const DeleteProduct = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [sortOption, setSortOption] = useState("");
  const [orderOption, setOrderOption] = useState("");

  // ========== State for custom popup messages ==========
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success"); // 'success' or 'error'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch all products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // ==========  Function to show custom popup ==========
  const showCustomPopup = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };
  // ======== Functions for delete confirmation popup ==========
  const showDeleteConfirmation = (productId, productName) => {
    setProductToDelete({ id: productId, name: productName });
    setShowDeleteConfirm(true);
  };

  const closeDeleteConfirmation = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

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

  const isExpired = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    return expDate < today;
  };

  const getExpiredProductsCount = () => {
    return products.filter((product) => isExpired(product.expiration_date))
      .length;
  };

  const getDaysUntilExpiration = (expirationDate) => {
    const today = new Date();
    const expDate = new Date(expirationDate);
    const timeDiff = expDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const handleDelete = async (productId, productName) => {


    setDeleting(productId);
    try {
      const token = localStorage.getItem("token");

      // ========== FIXED: Use the correct admin endpoint ==========
      const response = await fetch(
        `http://localhost:8000/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      

      // ========== Better error handling ==========
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      // ========= Get response data for confirmation ==========
      const responseData = await response.json();
      console.log("Delete response:", responseData);
      

      // Remove the product from local state
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      setAllProducts((prev) =>
        prev.filter((product) => product.id !== productId)
      );

      // ==========Replace alert with custom popup ==========
      showCustomPopup(
        `Product "${productName}" deleted successfully from database!`,
        "success"
      );
      
    } catch (err) {
      console.error("Delete error:", err);
      // ========= Replace alert with custom popup ==========
      showCustomPopup("Error deleting product: " + err.message, "error");
      
    } finally {
      setDeleting(null);
      closeDeleteConfirmation();
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
    } else if (sortOption === "expiration") {
      sortedProducts.sort((a, b) => {
        const dateA = new Date(a.expiration_date);
        const dateB = new Date(b.expiration_date);
        return orderOption === "descending" ? dateB - dateA : dateA - dateB;
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
      <div className="Shop-container">
        <div className="content">
          <div className="loading">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="Shop-container">
        <div className="content">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  const expiredCount = getExpiredProductsCount();

  return (
    <div className="Shop-container">
      {/* ====== Custom Popup Modal ========== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-modal ${popupType}`}>
            <div className="popup-content">
              <div className="popup-icon">
                {popupType === "success" ? "✅" : "❌"}
              </div>
              <div className="popup-message">{popupMessage}</div>
              <button className="popup-close-btn" onClick={closePopup}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========= Delete Confirmation Popup ========== */}
      {showDeleteConfirm && productToDelete && (
        <div className="popup-overlay">
          <div className="popup-modal confirm-delete">
            <div className="popup-content">
              <div className="popup-icon">⚠️</div>
              <div className="popup-message">
                Are you sure you want to delete `{productToDelete.name}`? This action cannot be undone.
              </div>
              <div className="popup-confirm-buttons">
                <button 
                  className="popup-confirm-btn confirm-yes"
                  onClick={() => handleDelete(productToDelete.id, productToDelete.name)}
                  disabled={deleting === productToDelete.id}
                >
                  {deleting === productToDelete.id ? (
                    <>
                      <span className="loading-spinner"></span>
                      Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
                <button 
                  className="popup-confirm-btn confirm-no"
                  onClick={closeDeleteConfirmation}
                  disabled={deleting === productToDelete.id}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     


      <div className="content">
        <h2>Delete Products</h2>
        <p>
          Click on product names to view details. Use delete buttons to remove
          products. Expired products are highlighted in red.
        </p>
      </div>

      {expiredCount > 0 && (
        <div className="expired-alert">
          <strong>⚠️ Warning:</strong> {expiredCount} product
          {expiredCount > 1 ? "s" : ""} expired and highlighted in red below.
        </div>
      )}

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
            <option value="expiration">Expiration Date</option>
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

      <div className="goods-container">
        <strong>Products Available for Deletion ({products.length})</strong>
      </div>

      <section className="mt-5">
        <div id="goods-container">
          {products.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            products.map((product) => {
              const expired = isExpired(product.expiration_date);
              const daysUntilExp = getDaysUntilExpiration(
                product.expiration_date
              );

              return (
                <div
                  key={product.id}
                  className={`goods-card ${expired ? "expired" : ""}`}
                >
                  <img
                    src={product.image ? product.image : "default-image.jpg"}
                    alt={product.name}
                    className="goods-image"
                  />
                  <div className="goods-info">
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

                    <div
                      className={`expiration-info ${
                        expired
                          ? "expired"
                          : daysUntilExp <= 30
                          ? "warning"
                          : "normal"
                      }`}
                    >
                      <div className="expiration-date">
                        <strong>Expires:</strong>{" "}
                        {new Date(product.expiration_date).toLocaleDateString()}
                      </div>

                      {expired ? (
                        <div className="expiration-status expired-status">
                          <span className="status-icon">⚠️</span>
                          <span className="status-text">EXPIRED</span>
                        </div>
                      ) : daysUntilExp <= 30 ? (
                        <div className="expiration-status warning-status">
                          <span className="status-icon">⏰</span>
                          <span className="status-text">
                            {daysUntilExp} days left
                          </span>
                        </div>
                      ) : (
                        <div className="expiration-status normal-status">
                          <span className="status-icon">✅</span>
                          <span className="status-text">
                            {daysUntilExp} days left
                          </span>
                        </div>
                      )}
                    </div>

                    <button
                      className={`delete-btn ${
                        expired ? "expired-delete" : ""
                      }`}
                      onClick={() => showDeleteConfirmation(product.id, product.name)}
                      disabled={deleting === product.id}
                    >
                      {deleting === product.id ? (
                        <>
                          <span className="loading-spinner"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <span className="delete-icon">🗑️</span>
                          Delete
                        </>
                      )}
                    </button>
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

export default DeleteProduct;
