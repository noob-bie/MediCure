import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import PropTypes from "prop-types";

const CartComponent = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get("/cart");
            setCartItems(response.data.cart_items || []);
        } catch (error) {
            console.error("Failed to fetch cart", error);
            setError(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    if (loading) return <p>Loading cart...</p>;
    if (error) return <p>Error loading cart.</p>;

    return children({ cartItems, setCartItems, fetchCart });
};

CartComponent.propTypes = {
    children: PropTypes.func.isRequired,
};

export default CartComponent;
