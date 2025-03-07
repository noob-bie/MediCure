import CartComponent from "../../components/cart/CartComponent";
import axiosInstance from "../../utils/axiosInstance";
import "./Cart.css";

const Cart = () => {
    return (
        <CartComponent>
            {({ cartItems, setCartItems }) => (
                <div>
                    <h2>Your Cart</h2>
                    {cartItems.map(item => (
                        <div key={item.id}>
                            <p>{item.product.name} - {item.quantity}</p>
                            <button onClick={() => removeItem(item.id, cartItems, setCartItems)}>Remove</button>
                        </div>
                    ))}
                </div>
            )}
        </CartComponent>
    );
};

const removeItem = (id, cartItems, setCartItems) => {
    axiosInstance.delete(`/cart/items/${id}`).then(() => {
        setCartItems(cartItems.filter(item => item.id !== id));
    });
};

export default Cart;