import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SingleProductUpdate.css";

const SingleProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Units for non-medicine products (same as AddProduct)
  const unitOptions = [
    "ml",
    "gm",
    "piece",
    "bottle",
    "tube",
    "pack",
    "box",
    "liter",
    "kg",
  ];

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("success");

  const [editForm, setEditForm] = useState({
    price: "",
    description: "",
    stock_quantity: 0,
    sales_count: 0,
    unitQuantity: "", // NEW: Separate unit quantity
    unitType: "",     // NEW: Separate unit type
    image: "",
  });

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const showCustomPopup = (message, type = "success") => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupMessage("");
  };

  // NEW: Function to parse existing unit value into quantity and type
  const parseUnitValue = (unitString) => {
    if (!unitString) return { quantity: "", type: "" };
    
    // Try to extract number and unit from string like "500 ml" or "2 piece"
    const match = unitString.match(/^(\d+(?:\.\d+)?)\s*(.+)$/);
    if (match) {
      return {
        quantity: match[1],
        type: match[2]
      };
    }
    
    // If no number found, treat entire string as type
    return {
      quantity: "",
      type: unitString
    };
  };

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login as admin to access this page");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();
      setProduct(data);

      // NEW: Parse unit value into quantity and type
      const parsedUnit = parseUnitValue(data.unit);

      // Initialize form with current product data - include ALL fields
      setEditForm({
        name: data.name || "",
        price: data.price || "",
        category: data.category || "",
        description: data.description || "",
        stock_quantity: data.stock_quantity || 0,
        sales_count: data.sales_count || 0,
        manufacturer: data.manufacturer || "",
        expiration_date: data.expiration_date || "",
        manufacture_date: data.manufacture_date || "",
        unitQuantity: parsedUnit.quantity, // NEW: Set parsed quantity
        unitType: parsedUnit.type,         // NEW: Set parsed type
        image: data.image || "",
        // Medicine specific fields
        generic_name: data.generic_name || "",
        dosage: data.dosage || "",
        indications: data.indications || "",
        contraindications: data.contraindications || "",
        // Normal product specific fields
        brand: data.brand || "",
      });

      // Set preview image if product has an image
      if (data.image) {
        setPreviewImage(data.image);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Modified stock change handler to not affect sales count
  const handleStockChange = (action) => {
    const currentStock = editForm.stock_quantity;

    if (action === "increase") {
      setEditForm((prev) => ({
        ...prev,
        stock_quantity: currentStock + 1,
      }));
    } else if (action === "decrease" && currentStock > 0) {
      setEditForm((prev) => ({
        ...prev,
        stock_quantity: currentStock - 1,
      }));
    }
  };

  // Modified sales change handler to affect stock quantity inversely
  const handleSalesChange = (action) => {
    const currentStock = editForm.stock_quantity;
    const currentSales = editForm.sales_count;

    if (action === "increase" && currentStock > 0) {
      setEditForm((prev) => ({
        ...prev,
        sales_count: currentSales + 1,
        stock_quantity: currentStock - 1,
      }));
    } else if (action === "decrease" && currentSales > 0) {
      setEditForm((prev) => ({
        ...prev,
        sales_count: currentSales - 1,
        stock_quantity: currentStock + 1,
      }));
    }
  };

  // Image file handler
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result; // This includes "data:image/jpeg;base64,"
        setPreviewImage(base64String);

        // Store the complete base64 string WITH the data URI prefix
        setEditForm((prev) => ({
          ...prev,
          image: base64String, // Keep the full data URI format
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to remove image
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage(null);
    setEditForm((prev) => ({
      ...prev,
      image: "",
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");

      // Prepare the update data - only send fields that can be updated
      const updateData = {
        price: parseFloat(editForm.price) || 0,
        description: editForm.description,
        stock_quantity: parseInt(editForm.stock_quantity) || 0,
        sales_count: parseInt(editForm.sales_count) || 0,
      };

      // NEW: Construct unit string from quantity and type
      if (product.category !== "Medicines") {
        let unitString = "";
        if (editForm.unitQuantity && editForm.unitType) {
          unitString = `${editForm.unitQuantity} ${editForm.unitType}`;
        } else if (editForm.unitType) {
          unitString = editForm.unitType;
        }
        
        if (unitString) {
          updateData.unit = unitString;
        }
      }

      // Add image if it exists
      if (editForm.image) {
        updateData.image = editForm.image;
      }

      // Add category-specific fields if they exist
      if (product.category === "Medicines") {
        if (editForm.generic_name)
          updateData.generic_name = editForm.generic_name;
        if (editForm.dosage) updateData.dosage = editForm.dosage;
        if (editForm.indications) updateData.indications = editForm.indications;
        if (editForm.contraindications)
          updateData.contraindications = editForm.contraindications;
      } else {
        if (editForm.brand) updateData.brand = editForm.brand;
      }

      console.log("Sending update data:", updateData); // For debugging

      // Use the correct admin route
      const response = await fetch(
        `http://localhost:8000/api/admin/products/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed:", errorData); // For debugging
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const updatedProduct = await response.json();
      console.log("Update successful:", updatedProduct); // For debugging

      // Update local state
      setProduct((prev) => ({ ...prev, ...updateData }));

      showCustomPopup("Product updated successfully!", "success");
      // Delay navigation to show the popup
      setTimeout(() => {
        navigate("/admin/product-management/Update Products");
      }, 2000);
    } catch (err) {
      console.error("Update error:", err); // For debugging
      // ========== MODIFIED: Replace alert with custom popup ==========
      showCustomPopup("Error updating product: " + err.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/product-management/Update Products");
  };

  if (loading) {
    return (
      <div className="single-product-update-container">
        <div className="loading">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="single-product-update-container">
        <div className="error">Error: {error || "Product not found"}</div>
        <button className="back-btn" onClick={handleCancel}>
          ← Back to Update Products
        </button>
      </div>
    );
  }

  return (
    <div className="single-product-update-container">
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
      <div className="update-card">
        {/* Left Side: Product Info */}
        <div className="product-display">
          <h1 className="product-name">{product.name}</h1>
          {(previewImage || product.image) && (
            <img
              src={
                previewImage ||
                (product.image ? product.image : "default-image.jpg")
              }
              alt={product.name}
              className="product-image"
            />
          )}
          <div className="product-basic-info">
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Manufacturer:</strong> {product.manufacturer}
            </p>
            <p>
              <strong>Expiration:</strong>{" "}
              {new Date(product.expiration_date).toLocaleDateString()}
            </p>
            {product.generic_name && (
              <p>
                <strong>Generic Name:</strong> {product.generic_name}
              </p>
            )}
            {product.dosage && (
              <p>
                <strong>Dosage:</strong> {product.dosage}
              </p>
            )}
            {product.brand && (
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
            )}
            {product.unit && (
              <p>
                <strong>Unit:</strong> {product.unit}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Edit Form */}
        <div className="update-form">
          <h2>Update Product Details</h2>

          <div className="form-group">
            <label>Price (৳):</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={editForm.price}
              onChange={(e) =>
                handleInputChange("price", parseFloat(e.target.value) || 0)
              }
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea
              value={editForm.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              placeholder="Enter product description"
            />
          </div>

          <div className="quantity-section">
            <div className="form-group">
              <label>Stock Quantity:</label>
              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => handleStockChange("decrease")}
                  disabled={editForm.stock_quantity <= 0}
                  className="quantity-btn decrease"
                >
                  -
                </button>
                <span className="quantity-display">
                  {editForm.stock_quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleStockChange("increase")}
                  className="quantity-btn increase"
                >
                  +
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Sales Count:</label>
              <div className="quantity-controls">
                <button
                  type="button"
                  onClick={() => handleSalesChange("decrease")}
                  disabled={editForm.sales_count <= 0}
                  className="quantity-btn decrease"
                >
                  -
                </button>
                <span className="quantity-display">{editForm.sales_count}</span>
                <button
                  type="button"
                  onClick={() => handleSalesChange("increase")}
                  disabled={editForm.stock_quantity <= 0}
                  className="quantity-btn increase"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="total-info">
            <p>
              <strong>Total Available:</strong> {editForm.stock_quantity}
            </p>
            <small>
              Note: When sales count changes, stock quantity adjusts inversely.
              Stock changes do not affect sales.
            </small>
          </div>

          {/* NEW: Updated Unit section for non-medicine products */}
          {product.category !== "Medicines" && (
            <div className="form-group">
              <label>Unit:</label>
              <div className="unit-input-group">
                <input
                  type="number"
                  value={editForm.unitQuantity}
                  onChange={(e) => handleInputChange("unitQuantity", e.target.value)}
                  className="form-input unit-quantity"
                  placeholder="Qty"
                  min="1"
                  step="1"
                />
                <select
                  value={editForm.unitType}
                  onChange={(e) => handleInputChange("unitType", e.target.value)}
                  className="form-select unit-type"
                >
                  <option value="">Select Unit</option>
                  {unitOptions.map((unit, index) => (
                    <option key={index} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
              <small className="unit-help-text">
                Enter quantity and select unit type
              </small>
            </div>
          )}

          {/* Image upload section */}
          <div className="form-group">
            <label>Update Product Image:</label>
            <div className="image-upload-section">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              {previewImage && (
                <div className="image-preview">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="preview-img"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="remove-img-btn"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Or paste Base64 Image:</label>
            <textarea
              value={editForm.image}
              onChange={(e) => {
                const value = e.target.value;
                handleInputChange("image", value);

                if (value) {
                  // Check if the value already has the data URI prefix
                  if (value.startsWith("data:image/")) {
                    setPreviewImage(value);
                  } else {
                    // If it doesn't have the prefix, add it for preview
                    setPreviewImage(`data:image/jpeg;base64,${value}`);
                  }
                } else {
                  setPreviewImage(null);
                }
              }}
              rows={3}
              placeholder="Paste base64 encoded image here (optional)"
            />
          </div>

          <div className="form-buttons">
            <button
              className="update-btn"
              onClick={handleUpdate}
              disabled={updating}
            >
              {updating ? (
                <>
                  <span className="loading-spinner"></span>
                  Updating...
                </>
              ) : (
                "Confirm Update"
              )}
            </button>
            <button
              className="cancel-btn"
              onClick={handleCancel}
              disabled={updating}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProductUpdate;