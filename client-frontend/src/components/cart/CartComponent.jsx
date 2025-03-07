import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const CartComponent = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        axiosInstance.get("/cart")
            .then(response => setCartItems(response.data.cart_items || []))
            .catch(error => console.error("Failed to fetch cart", error));
    }, []);

    return children({ cartItems, setCartItems });
};

export default CartComponent;