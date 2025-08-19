import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Payment.css";
import cashIcon from "../../assets/images/cash-icon.png";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, totalAmount , selectedCartItems} = location.state || {};
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [errorMessage, setErrorMessage] = useState(null);

const handleConfirmOrder = async () => {
  if (!orderId) {
    setErrorMessage("Order ID is missing. Please go back to checkout.");
    return;
  }

  try {
    const response = await axiosInstance.post(`/confirm-order`, {
      order_id: orderId,
    });

    if (response.status === 200) {
      // remove only the selected items from cart
      const itemIds = selectedCartItems.map(item => item.id);

      await axiosInstance.post(`/cart/remove-items`, { item_ids: itemIds });

      setShowPopup(true);
    } else {
      setErrorMessage("Failed to confirm order. Please try again.");
    }
  } catch (error) {
    console.error("Error confirming order:", error);
    setErrorMessage("Failed to confirm order. Please try again.");
  }
};


  const handleOkClick = () => {
    // ✅ clear any local cart cache you might be keeping
    try {
      localStorage.removeItem("cart");
      localStorage.removeItem("cartItems");
      // if you track a count/badge etc.
      localStorage.removeItem("cartCount");
    } catch (e) {
      // ignore
    }

    setShowPopup(false);
    navigate("/shop");
  };

  return (
    <div className="payment-container">
      <h2>Select Payment Method</h2>

      <div className="payment-option">
        <h3>Available Payment Method</h3>
        <div className="payment-method">
          <img src={cashIcon} alt="Cash on Delivery" className="cash-icon" />
          <span>Cash on Delivery</span>
        </div>
      </div>

      <div className="order-total">
        <span>Total Amount:</span>
        <span>৳ {totalAmount || "N/A"}</span>
      </div>

      {errorMessage && (
        <div className="confirmation-message error">{errorMessage}</div>
      )}

      <button
        className="confirm-order-btn"
        onClick={handleConfirmOrder}
        disabled={!orderId}
      >
        Confirm Order
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>Your order is confirmed and will be delivered soon.</p>
            <button onClick={handleOkClick}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
