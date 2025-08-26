import CartComponent from "../../components/cart/CartComponent";
import axiosInstance from "../../utils/axiosInstance";
import "./Cart.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Cart = () => {
    return (
        <CartComponent>
            {({ cartItems, setCartItems, fetchCart }) => (
                <CartContent
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    fetchCart={fetchCart}
                />
            )}
        </CartComponent>
    );
};

const CartContent = ({ cartItems, setCartItems, fetchCart }) => {
    const [quantities, setQuantities] = useState({});
    const [selectedItems, setSelectedItems] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const initialQuantities = {};
        cartItems.forEach((item) => {
            initialQuantities[item.id] = item.quantity;
        });
        setQuantities(initialQuantities);

        const initialSelectedItems = {};
        cartItems.forEach((item) => {
            initialSelectedItems[item.id] = false;
        });
        setSelectedItems(initialSelectedItems);
        setSelectAll(false);
    }, [cartItems]);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) newQuantity = 1;
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [itemId]: newQuantity,
        }));

        setCartItems((currentCartItems) =>
            currentCartItems.map((item) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );

        axiosInstance
            .put(`/cart/items/${itemId}`, { quantity: newQuantity }) // Corrected template literal syntax
            .catch((error) => {
                console.error("Error updating cart item quantity:", error);
                fetchCart();
                alert("Failed to update quantity. Please try again.");
            });
    };

    const removeItem = (itemId) => {
        axiosInstance.delete(`/cart/items/${itemId}`).then(() => { // Corrected template literal syntax
            setCartItems((prevCartItems) =>
                prevCartItems.filter((item) => item.id !== itemId)
            );
            setQuantities((prevQuantities) => {
                const newQuantities = { ...prevQuantities };
                delete newQuantities[itemId];
                return newQuantities;
            });
            setSelectedItems((prevSelectedItems) => {
                const newSelectedItems = { ...prevSelectedItems };
                delete newSelectedItems[itemId];
                return newSelectedItems;
            });
            setSelectAll(false);
        });
    };

    const handleCheckboxChange = (itemId) => {
        setSelectedItems((prevSelectedItems) => ({
            ...prevSelectedItems,
            [itemId]: !prevSelectedItems[itemId],
        }));
    };

    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        const updatedSelectedItems = {};
        cartItems.forEach((item) => {
            updatedSelectedItems[item.id] = !selectAll;
        });
        setSelectedItems(updatedSelectedItems);
    };

    const calculateItemTotal = (item) => {
        return Number(item.product.price) * quantities[item.id];
    };

    const calculateCartTotal = () => {
        let total = 0;
        cartItems.forEach((item) => {
            if (selectedItems[item.id]) {
                total += calculateItemTotal(item);
            }
        });
        return total;
    };

    const handleCheckout = async () => {
        const selectedCartItems = cartItems.filter(item => selectedItems[item.id]);

        if (selectedCartItems.length === 0) {
            alert("Please select items to checkout.");
            return;
        }

        // Navigate to checkout and pass selectedCartItems as state
        navigate('/checkout', { state: { selectedCartItems } });
    };

    const selectedCount = Object.values(selectedItems).filter((isSelected) => isSelected).length;
    const allSelected = selectedCount === cartItems.length && cartItems.length > 0;
    const isIndeterminate = selectedCount > 0 && selectedCount < cartItems.length;

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>

            <div className="cart-select-all">
                <input
                    type="checkbox"
                    id="selectAll"
                    checked={allSelected}
                    onChange={handleSelectAllChange}
                    ref={(checkbox) => {
                        if (checkbox) {
                            checkbox.indeterminate = isIndeterminate;
                        }
                    }}
                />
                <label htmlFor="selectAll">Select All</label>
            </div>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <input
                                type="checkbox"
                                checked={selectedItems[item.id] || false}
                                onChange={() => handleCheckboxChange(item.id)}
                            />
                            <p>{item.product.name}</p>
                            <div className="quantity-controls">
                                <button
                                    onClick={() =>
                                        handleQuantityChange(item.id, quantities[item.id] - 1)
                                    }
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantities[item.id]}
                                    min="1"
                                    onChange={(e) =>
                                        handleQuantityChange(item.id, parseInt(e.target.value))
                                    }
                                />
                                <button
                                    onClick={() =>
                                        handleQuantityChange(item.id, quantities[item.id] + 1)
                                    }
                                >
                                    +
                                </button>
                            </div>
                            <p className="item-price">Price: ৳{item.product.price}</p>
                            <p className="item-total-price">Total: ৳{calculateItemTotal(item)}</p>
                            <button onClick={() => removeItem(item.id)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}

            <div className="cart-total">
                <strong>Cart Total (Selected Items): ৳{calculateCartTotal()}</strong>
            </div>

            {cartItems.length > 0 && (
                <button className="checkout-button" onClick={handleCheckout}>
                    Checkout
                </button>
            )}
        </div>
    );
};

// Define PropTypes for CartContent
CartContent.propTypes = {
    cartItems: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            quantity: PropTypes.number.isRequired,
            product: PropTypes.shape({
                price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ✅ Allow both
                name: PropTypes.string.isRequired,
            }).isRequired,
        })
    ).isRequired,
    setCartItems: PropTypes.func.isRequired,
    fetchCart: PropTypes.func.isRequired,
};

export default Cart;