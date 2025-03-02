import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./Cart.css";
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate(); // Initialize navigation
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      store: "LIVE PHARMACY",
      delivery: "1-3 Days Delivery",
      productName: "Napa (500mg)",
      price: 25,
      originalPrice: 30,
      image: "https://epharma.com.bd/storage/app/public/YAc63qF4DRdd4GParo03FyE17vVRCKEFFZc2eGoi.webp",
      quantity: 1,
    },
    {
      id: 2,
      store: "Dulal Pharmacy",
      productName: "Ace (500mg)",
      price: 10,
      originalPrice: 12,
      image: "https://medeasy.health/_next/image?url=https://api.medeasy.health/media/medicines/ace-500-mg.jpg&w=750&q=75",
      quantity: 1,
    },
    {
      id: 3,
      store: "MM DRUGS STORE",
      productName: "Losectil (20mg)",
      price: 50,
      originalPrice: 60,
      image: "https://cdn2.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC8xMDg5MVwvMTA4OTEtbG9zZWN0aWwtMjAtQ2FwLWNvcHkta3BhMHF6LmpwZWciLCJlZGl0cyI6W119",
      quantity: 1,
    },
    {
      id: 4,
      store: "MM DRUGS STORE",
      productName: "Maxpro (20mg)",
      price: 55,
      originalPrice: 60,
      image: "https://medex.com.bd/storage/images/packaging/maxpro-20-mg-tablet-11414064409-i1-pVhK0C8pZNFoIMztwlWS.jpg",
      quantity: 1,
    },
    {
      id: 5,
      store: "MM DRUGS STORE",
      productName: "Alatrol (10 mg)",
      price: 22,
      originalPrice: 25,
      image: "https://medex.com.bd/storage/images/packaging/alatrol-10-mg-tablet-59253519459-i1-OXgsEr7yWZ4WnGge2aGp.jpg",
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (id, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } }); // Passing cartItems as state
  };  

  return (
    <div className="cart-container">
      <h2>My Cart</h2>
      <div className="cart-location">
        📍 <span>Kunipara, Dhaka - North, Dhaka</span>
      </div>
      {cartItems.map((item) => (
        <div key={item.id} className="cart-item">
          <input type="checkbox" />
          <div className="cart-details">
            <p className="store-name">{item.store}</p>
            <div className="cart-product">
              <img src={item.image} alt={item.productName} />
              <div className="cart-info">
                <p className="product-name">{item.productName}</p>
                <p className="price">
                  ৳{item.price} <span className="original-price">৳{item.originalPrice}</span>
                </p>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, "decrease")}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, "increase")}>+</button>
                </div>
              </div>
            </div>
          </div>
          <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
            <FaTrash />
          </button>
        </div>
      ))}
      <div className="cart-footer">
        <div className="subtotal">
          <span>Subtotal:</span>
          <span>৳ {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          Check Out ({cartItems.length})
        </button>
      </div>
    </div>
  );
};

//Add PropTypes Validation
Cart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      store: PropTypes.string.isRequired,
      productName: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      originalPrice: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  setCartItems: PropTypes.func.isRequired,
};

export default Cart;
