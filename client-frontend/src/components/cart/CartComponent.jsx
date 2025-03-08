import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import PropTypes from 'prop-types'; // Import PropTypes

const CartComponent = ({ children }) => { // Destructure children from props
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get("/cart");
            setCart(response.data);
            setCartItems(response.data.cart_items || []);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setError(error);
            setLoading(false);
        }
    }, []); // Removed axiosInstance from dependency array

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    if (loading) {
        return <p>Loading cart...</p>;
    }

    if (error) {
        return <p>Error loading cart: {error.message}</p>;
    }

    if (!cart) {
        return <p>Could not load cart data.</p>;
    }

    return children({ cartItems, setCartItems, fetchCart });
};

// Define PropTypes for CartComponent
CartComponent.propTypes = {
    children: PropTypes.node // Expects children to be a React node
};

export default CartComponent;