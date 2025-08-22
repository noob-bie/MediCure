// checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Checkout.css";

const Checkout = () => {
  const [formData, setFormData] = useState({
    delivery_address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCartItems, setSelectedCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    if (location.state && location.state.selectedCartItems) {
      setSelectedCartItems(location.state.selectedCartItems);
    }
  }, [location.state]);

  useEffect(() => {
    const calculateTotal = () => {
      let total = 0;
      selectedCartItems.forEach((item) => {
        total += item.quantity * item.product.price;
      });
      setCartTotal(total);
    };
    calculateTotal();
  }, [selectedCartItems]);

  useEffect(() => {
    console.log("Location state:", location.state);
    console.log("orderId passed:", location.state?.ordersId);
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send payload in the format backend expects
      const orderPayload = {
        order_items: selectedCartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        total_price: cartTotal,
        status: "pending",
        delivery_address: formData.delivery_address,
      };

      const response = await axiosInstance.post("/orders", orderPayload);

      console.log("Order created:", response.data);

      navigate("/payment", {
        state: {
          formData,
          //selectedCartItems,
          selectedCartItemIds: selectedCartItems.map(i => i.id), // ✅ pass only IDs
          totalAmount: cartTotal,
          orderId: response.data.order.id, // your backend returns { order: { id: ... } }
          
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {selectedCartItems.length > 0 ? (
        <div className="checkout-items-list">
          <h3>Order Summary:</h3>
          {selectedCartItems.map((item) => (
            <div key={item.id} className="checkout-item">
              <p>
                {item.product.name} x {item.quantity}
              </p>
              <p>৳{item.quantity * item.product.price}</p>
            </div>
          ))}
          <div className="checkout-total">
            <strong>Total: ৳{cartTotal}</strong>
          </div>
        </div>
      ) : (
        <p>No items selected for checkout. Please select items in your cart.</p>
      )}

      {selectedCartItems.length > 0 && (
        <form onSubmit={handleSubmit}>
          <label>Delivery Address:</label>
          <input
            type="text"
            name="delivery_address"
            value={formData.delivery_address}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Proceeding to Payment..." : "Proceed to Payment"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Checkout;
