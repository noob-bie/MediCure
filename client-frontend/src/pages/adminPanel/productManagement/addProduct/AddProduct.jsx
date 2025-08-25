import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const AddProduct = () => {
  const navigate = useNavigate();

  // Manufacturer data organized by category
  const manufacturerData = {
    Medicines: [
      { id: 1, name: "Square Pharmaceuticals Ltd." },
      { id: 2, name: "Beximco Pharmaceuticals Ltd." },
      { id: 3, name: "Incepta Pharmaceuticals Ltd." },
      { id: 4, name: "ACI Limited" },
      { id: 5, name: "Aristopharma Ltd." },
      { id: 6, name: "Renata Limited" },
      { id: 7, name: "Opsonin Pharma Limited" },
      { id: 8, name: "Healthcare Pharmaceuticals Limited" },
      { id: 9, name: "Drug International Limited" },
      { id: 10, name: "Popular Pharmaceuticals Ltd." },
      { id: 11, name: "Globe Pharmaceuticals Ltd." },
      { id: 12, name: "IBN SINA Pharmaceutical Industry Ltd." },
    ],
    Healthcare: [
      { id: 1, name: "Square Toiletries Ltd." },
      { id: 2, name: "Unilever Bangladesh Limited" },
      { id: 3, name: "ACI Consumer Brands" },
      { id: 4, name: "Marico Bangladesh Limited" },
      { id: 5, name: "Dabur Bangladesh Pvt. Ltd." },
      { id: 6, name: "Himalaya Drug Company" },
      { id: 7, name: "P&G Bangladesh" },
      { id: 8, name: "Johnson & Johnson Bangladesh" },
      { id: 9, name: "GSK Consumer Healthcare" },
      { id: 10, name: "Reckitt Benckiser Bangladesh" },
    ],
    "Home Care": [
      { id: 1, name: "RFL Group" },
      { id: 2, name: "ACI Consumer Brands" },
      { id: 3, name: "Unilever Bangladesh Limited" },
      { id: 4, name: "Partex Group" },
      { id: 5, name: "Square Toiletries Ltd." },
      { id: 6, name: "Keyline Brands Limited" },
      { id: 7, name: "City Group" },
      { id: 8, name: "P&G Bangladesh" },
      { id: 9, name: "Reckitt Benckiser Bangladesh" },
      { id: 10, name: "Harpic Bangladesh" },
    ],
    "Baby & Mom Care": [
      { id: 1, name: "Johnson & Johnson Bangladesh" },
      { id: 2, name: "Unilever Bangladesh Limited" },
      { id: 3, name: "P&G Bangladesh" },
      { id: 4, name: "Himalaya Drug Company" },
      { id: 5, name: "Dabur Bangladesh Pvt. Ltd." },
      { id: 6, name: "ACI Consumer Brands" },
      { id: 7, name: "Square Baby Care" },
      { id: 8, name: "Marico Bangladesh Limited" },
      { id: 9, name: "Goodlife Company Ltd." },
      { id: 10, name: "Meril Consumer Products" },
    ],
  };

  // Generic names for medicines
  const genericNameData = [
    "Paracetamol",
    "Ibuprofen",
    "Azithromycin",
    "Cefixime",
    "Metformin",
    "Omeprazole",
    "Atorvastatin",
    "Losartan",
    "Salbutamol",
    "Amoxicillin",
    "Ciprofloxacin",
    "Montelukast",
    "Cetirizine",
    "Ranitidine",
    "Gliclazide",
    "Clopidogrel",
    "Levofloxacin",
    "Doxycycline",
    "Fluconazole",
    "Amlodipine",
  ];

  // Units for non-medicine products
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

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    genericName: "",
    dosage: "",
    price: "",
    stock: "",
    expirationDate: "",
    manufactureDate: "",
    manufacturer: "",
    brand: "",
    unitQuantity: "", // ADDED: New field for unit quantity
    unitType: "",
    description: "",
    image: "",
  });

  const [dateError, setDateError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If category changes, reset related fields
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        manufacturer: "",
        genericName: "",
        dosage: "",
        brand: "",
        unitQuantity: "", // ADDED: Reset unit quantity
        unitType: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Real-time date validation
    if (name === "manufactureDate") {
      // If manufacture date is changed and expiration date exists, validate
      if (formData.expirationDate) {
        validateDates(value, formData.expirationDate);
      }
      // If expiration date was set but manufacture date is now later, clear expiration
      if (
        formData.expirationDate &&
        new Date(formData.expirationDate) <= new Date(value)
      ) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          expirationDate: "",
        }));
        setDateError("");
      }
    } else if (name === "expirationDate") {
      // Validate when expiration date is set
      validateDates(formData.manufactureDate, value);
    }
  };

  // Date validation - real-time validation
  const validateDates = (
    manufactureDate = formData.manufactureDate,
    expirationDate = formData.expirationDate
  ) => {
    if (!manufactureDate) {
      setDateError("");
      return true;
    }

    if (!expirationDate) {
      setDateError("");
      return true;
    }

    const manufactureDateTime = new Date(manufactureDate);
    const expirationDateTime = new Date(expirationDate);

    if (expirationDateTime <= manufactureDateTime) {
      setDateError("Expiration date must be after manufacture date");
      return false;
    }

    setDateError("");
    return true;
  };

  // Check if expiration date input should be disabled
  const isExpirationDisabled = () => {
    return !formData.manufactureDate;
  };

  // Get minimum date for expiration (day after manufacture date)
  const getMinExpirationDate = () => {
    if (!formData.manufactureDate) return "";

    const manufactureDate = new Date(formData.manufactureDate);
    manufactureDate.setDate(manufactureDate.getDate() + 1);
    return manufactureDate.toISOString().split("T")[0];
  };

  // Handle success modal close
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    // Reset form after closing modal
    setFormData({
      name: "",
      category: "",
      genericName: "",
      dosage: "",
      price: "",
      stock: "",
      expirationDate: "",
      manufactureDate: "",
      manufacturer: "",
      brand: "",
      unitQuantity: "", // ADDED: Reset unit quantity
      unitType: "",
      description: "",
      image: "",
    });
    setDateError("");
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Get manufacturers for selected category
  const getManufacturersForCategory = () => {
    if (!formData.category) return [];
    return manufacturerData[formData.category] || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates first
    if (!validateDates()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const productData = {
        name: formData.name,
        category: formData.category,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock),
        description: formData.description,
        manufacturer: formData.manufacturer,
        expiration_date: formData.expirationDate,
        manufacture_date: formData.manufactureDate,
        image: formData.image,
      };

      // Add medicine-specific fields
      if (formData.category === "Medicines") {
        productData.generic_name = formData.genericName;
        productData.dosage = formData.dosage;
        productData.indications = "";
        productData.contraindications = "";
      } else {
        // Add non-medicine specific fields
        productData.brand = formData.brand;
        productData.unit =
          formData.unitQuantity && formData.unitType
            ? `${formData.unitQuantity} ${formData.unitType}`
            : formData.unitType || "";
      }

      // Get JWT token from localStorage
      const token =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("jwt_token");

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      console.log("Sending product data:", productData);
      console.log("Using token:", token.substring(0, 20) + "...");

      const response = await fetch("http://localhost:8000/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(productData),
      });

      const responseData = await response.json();
      console.log("Response:", responseData);

      if (response.ok) {
        console.log("Product added successfully:", responseData);
        setShowSuccessModal(true); // Show success modal instead of alert

        // Don't reset form here - will be reset when modal is closed
      } else {
        console.error("Error adding product:", responseData);
        let errorMessage = "Unknown error occurred";

        if (responseData.error) {
          errorMessage = responseData.error;
        } else if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.details) {
          errorMessage = Object.values(responseData.details).flat().join(", ");
        }

        alert("Error adding product: " + errorMessage);

        // If unauthorized, redirect to login
        if (response.status === 401) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("token");
          localStorage.removeItem("jwt_token");
          // You can redirect to login page here
          // navigate('/login');
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToShop = () => {
    navigate("/shop");
  };

  return (
    <div className="add-product-container">
      <div className="add-product-content">
        <h2 className="add-product-title">Add Product</h2>

        <form className="add-product-form" onSubmit={handleSubmit}>
          {/* First Row: Name and Category */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select Category</option>
                <option value="Medicines">Medicines</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Home Care">Home Care</option>
                <option value="Baby & Mom Care">Baby & Mom Care</option>
              </select>
            </div>
          </div>

          {/* Medicine-specific fields: Generic Name and Dosage */}
          {formData.category === "Medicines" && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Generic Name</label>
                <select
                  name="genericName"
                  value={formData.genericName}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Generic Name</option>
                  {genericNameData.map((generic, index) => (
                    <option key={index} value={generic}>
                      {generic}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Dosage</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 500mg, 10ml, 1 tablet"
                  required
                />
              </div>
            </div>
          )}

          {/* Non-medicine specific fields: Brand and Unit */}
          {formData.category !== "" && formData.category !== "Medicines" && (
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Unit</label>
                <div className="unit-input-group">
                  <input
                    type="number"
                    name="unitQuantity"
                    value={formData.unitQuantity}
                    onChange={handleInputChange}
                    className="form-input unit-quantity"
                    placeholder="Qty"
                    min="1"
                    step="1"
                  />
                  <select
                    name="unitType"
                    value={formData.unitType}
                    onChange={handleInputChange}
                    className="form-select unit-type"
                    required
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
            </div>
          )}

          {/* Price and Stock Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (৳)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter price"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter stock quantity"
                min="0"
                required
              />
            </div>
          </div>

          {/* Dates Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Manufacture Date</label>
              <input
                type="date"
                name="manufactureDate"
                value={formData.manufactureDate}
                onChange={handleInputChange}
                className="form-input date-input"
                max={new Date().toISOString().split("T")[0]} // Can't be future date
                required
              />
              <small className="date-help-text">Must be today or earlier</small>
            </div>

            <div className="form-group">
              <label className="form-label">Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleInputChange}
                className={`form-input date-input ${
                  isExpirationDisabled() ? "disabled" : ""
                }`}
                min={getMinExpirationDate()}
                disabled={isExpirationDisabled()}
                required
              />
              <small className="date-help-text">
                {isExpirationDisabled()
                  ? "Please select manufacture date first"
                  : "Must be after manufacture date"}
              </small>
            </div>
          </div>

          {/* Date Error Display */}
          {dateError && (
            <div className="date-error">
              <p>{dateError}</p>
            </div>
          )}

          {/* Manufacturer Row */}
          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Manufacturer</label>
              <select
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleInputChange}
                className={`form-select ${
                  !formData.category ? "disabled" : ""
                }`}
                disabled={!formData.category}
                required
              >
                <option value="">
                  {!formData.category
                    ? "Please select a category first"
                    : "Select Manufacturer"}
                </option>
                {getManufacturersForCategory().map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.name}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Upload Row */}
          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-input file-input"
              />
              {formData.image && (
                <div className="image-preview">
                  <img src={formData.image} alt="Product Preview" />
                </div>
              )}
            </div>
          </div>

          {/* Description Row */}
          <div className="form-row">
            <div className="form-group full-width">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Enter product description"
                rows="4"
                required
              ></textarea>
            </div>
          </div>

          {/* Note */}
          <div className="form-note">
            <p>
              Fields marked required must be filled.
              {formData.category === "medicines"
                ? " Generic Name and Dosage are shown for Medicine category."
                : " Brand and Unit fields are shown for non-medicine categories."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="button-row">
            <button
              type="submit"
              className="add-product-btn"
              disabled={!!dateError || isSubmitting}
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
            <button
              type="button"
              className="back-to-products-btn"
              onClick={handleBackToShop}
            >
              Back to Shop
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="modal-overlay">
            <div className="success-modal">
              <div className="success-modal-content">
                <div className="success-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" fill="#28a745" />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="success-title">Success!</h3>
                <p className="success-message">
                  Product has been added successfully
                </p>
                <button
                  className="success-ok-button"
                  onClick={handleSuccessModalClose}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;