import React, { useState } from "react"; // Import useState
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance"; // Import axiosInstance
import "./Payment.css";
import cashIcon from "../../assets/images/cash-icon.png";

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId, totalAmount } = location.state || {}; // Receiving orderId and totalAmount from Checkout
    const [confirmationMessage, setConfirmationMessage] = useState(null); // State for confirmation message
    const [errorMessage, setErrorMessage] = useState(null); // State for error message

    console.log("Payment Component - location.state:", location.state);
    console.log("Payment Component - totalAmount:", totalAmount);

    const handleConfirmOrder = async () => {
        if (!orderId) {
            console.error("Order ID is missing. Cannot confirm order.");
            setErrorMessage("Order ID is missing. Please go back to checkout.");
            return;
        }

        console.log("Confirm Order button clicked for orderId:", orderId); // Debug log before API call
        setConfirmationMessage(null); // Clear any previous confirmation message
        setErrorMessage(null); // Clear any previous error message

        try {
            // Use axiosInstance.post to confirm order
            const response = await axiosInstance.post(
                `/confirm-order`, // Use relative URL
                { order_id: orderId }
            );

            console.log("Confirm Order API Response:", response); // Log API response

            if (response.status === 200) {
                console.log("Order confirmed successfully!");
                setConfirmationMessage("Order confirmed! Your order will be delivered soon."); // Set success message
                // Optionally, you can navigate to a confirmation page instead of alert and navigate home immediately
                // setTimeout(() => { navigate("/"); }, 3000); // Navigate home after 3 seconds, for example
            } else {
                console.error("Failed to confirm order. Status:", response.status, response.data);
                setErrorMessage("Failed to confirm order. Please try again."); // Set error message
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            setErrorMessage("Failed to confirm order. Please try again."); // Set error message
        }
    };

    return (
        <div className="payment-container">
            <h2>Select Payment Method</h2>

            {/* Payment Method Section */}
            <div className="payment-option">
                <h3>Available Payment Method</h3>
                <div className="payment-method">
                    <img src={cashIcon} alt="Cash on Delivery" className="cash-icon" />
                    <span>Cash on Delivery</span>
                </div>
            </div>

            {/* Order Total */}
            <div className="order-total">
                <span>Total Amount:</span>
                <span>৳ {totalAmount || "N/A"}</span>
            </div>

            {/* Confirmation Message Section */}
            {confirmationMessage && (
                <div className="confirmation-message success">
                    {confirmationMessage}
                </div>
            )}
            {errorMessage && (
                <div className="confirmation-message error">
                    {errorMessage}
                </div>
            )}

            {/* Confirm Order Button */}
            <button
                className="confirm-order-btn"
                onClick={handleConfirmOrder}
                disabled={!orderId || confirmationMessage === "Order confirmed! Your order will be delivered soon."} // Disable after successful confirmation
            >
                Confirm Order
            </button>
        </div>
    );
};

export default Payment;