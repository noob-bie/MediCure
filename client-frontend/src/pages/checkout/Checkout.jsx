import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"; 
import "./Checkout.css";

const Checkout = () => {
  const { state } = useLocation();
  const cartItems = state ? state.cartItems : [];

  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    navigate("/payment");
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      {/* Customer Info */}
      <div className="customer-info">
        <h3>Ishrat Jahan Mim</h3>
        <span>1975728958</span>
        <p>Insaf Tower, Happy Homes, Kunipara, Tejgaon, Dhaka - North, Dhaka</p>
      </div>

      {/* Cart Items */}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="checkout-item">
            <h4>{item.store}</h4>
            <div className="item-details">
              <img src={item.image} alt={item.productName} />
              <div className="info">
                <p className="product-name">{item.productName}</p>
                <p className="price">
                  ৳{item.price} x {item.quantity} = ৳{item.price * item.quantity}
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="delivery-option">
              <p><strong>Standard Delivery</strong></p>
              <p>Guaranteed by 5-8 Mar</p>
              <p>৳ 80</p>
            </div>
          </div>
        ))
      )}

      {/* Order Summary */}
      <div className="summary">
        <div>
          <span>Merchandise Subtotal ({cartItems.length} Items)</span>
          <span>৳ {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
        </div>
        <div>
          <span>Shipping Fee Subtotal</span>
          <span>৳ 80</span>
        </div>
        <div>
          <span>Voucher & Code</span>
          <a href="#">View or enter code</a>
        </div>
      </div>

      {/* Total & Place Order */}
      <div className="checkout-footer">
        <div className="total">
          <span>Total:</span>
          <span>৳ {cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + 80}</span>
        </div>
        <button className="place-order-btn" onClick={handlePlaceOrder}>
         Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
