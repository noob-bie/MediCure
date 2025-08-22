import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./Orders.css"; // Assuming you have some styles for orders
const Orders = () => {
  const [orders, setOrders] = useState([]); // ✅ make sure it starts as array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get("/orders");
        console.log("API Response:", response.data);

        // ✅ check if response.data is array or object
        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else if (Array.isArray(response.data.orders)) {
          setOrders(response.data.orders);
        } else {
          setOrders([]); // fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

return (
  <div className="orders-container">
    <h2>My Orders</h2>
    {orders.map((order) => (
      <div key={order.id} className="order-card">
        <h3>Order_ID: {order.id}</h3>
        <p>Status: {order.status}</p>
        <p>Total Price: {order.total_price} BDT</p>

        <h4>Products:</h4>
        <ul>
          {order.items.map((item) => (
            <li key={item.id}>
              {item.product?.name} - {item.quantity} pcs @ {item.price} BDT
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

};

export default Orders;
