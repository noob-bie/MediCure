import React from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";
import cashIcon from '../../assets/images/cash-icon.png';  // Importing the image

const Payment = () => {
  const navigate = useNavigate();
  const productTotal = 242;
  const finalTotal = productTotal;  // Now the total is just the product total, without the delivery charge.

  const handleConfirmOrder = () => {
    alert("Order placed successfully!");
    navigate("/");
  };

  return (
    <div className="payment-container">
      <h2>Select Payment Method</h2>

      {/* Payment Method Section */}
      <div className="payment-option">
        <h3>Available Payment Method</h3>
        <div className="payment-method">
          <img src={cashIcon} alt="Cash on Delivery" className="cash-icon" /> {/* Using the imported image */}
          <span>Cash on Delivery</span>
        </div>
      </div>

      {/* Order Total */}
      <div className="order-total">
        <span>Total Amount:</span>
        <span>৳ {finalTotal}</span>
      </div>

      {/* Confirm Order Button */}
      <button className="confirm-order-btn" onClick={handleConfirmOrder}>
        Confirm Order
      </button>
    </div>
  );
};

export default Payment;
