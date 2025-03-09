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
            selectedCartItems.forEach(item => {
                total += item.quantity * item.product.price;
            });
            setCartTotal(total);
        };
        calculateTotal();
    }, [selectedCartItems]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log("Form Data (Delivery Address):", formData);
        console.log("Order Items (to payment page):", selectedCartItems.map(item => ({
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
        })));
        console.log("Calculated cartTotal in Checkout:", cartTotal); // Debug log

        navigate("/payment", { state: { formData, selectedCartItems, totalAmount: cartTotal } });
        setLoading(false);
    };

    return (
        <div className="checkout-container">
            <h2>Checkout</h2>

            {selectedCartItems.length > 0 ? (
                <div className="checkout-items-list">
                    <h3>Order Summary:</h3>
                    {selectedCartItems.map(item => (
                        <div key={item.id} className="checkout-item">
                            <p>{item.product.name} x {item.quantity}</p>
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