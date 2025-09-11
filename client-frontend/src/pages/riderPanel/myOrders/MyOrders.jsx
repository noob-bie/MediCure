import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import './MyOrders.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/delivery/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching my orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/delivery/orders/${orderId}/status`, {
        status: newStatus
      });
      
      fetchMyOrders(); // Refresh orders
      alert(`Order marked as ${newStatus.replace('_', ' ')}!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  // ✅ New function to collect COD payment
  const handleCollectPayment = async (orderId) => {
    try {
      await axiosInstance.put(`/delivery/orders/${orderId}/collect-payment`);
      
      fetchMyOrders(); // Refresh orders
      alert('Payment collected successfully!');
    } catch (error) {
      console.error('Error collecting payment:', error);
      alert('Failed to collect payment');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'assigned': 'status-assigned',
      'on_the_way': 'status-on-way',
      'delivered': 'status-delivered'
    };
    
    return <span className={`status-badge ${statusClasses[status]}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>;
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div className="my-orders">
      <div className="page-header">
        <h2>My Assigned Orders</h2>
        <p>Orders currently assigned to you for delivery</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders assigned to you at the moment.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order #{order.id}</strong>
                  {getStatusBadge(order.status)}
                </div>
                <div className="order-total">
                  ৳{order.total_price}
                </div>
              </div>

              <div className="customer-info">
                <h4>Customer Details</h4>
                <p><strong>Name:</strong> {order.user.name}</p>
                <p><strong>Phone:</strong> {order.user.phone}</p>
                <p><strong>Address:</strong> {order.user.address}</p>
              </div>

              <div className="order-items">
                <h4>Items ({order.items.length})</h4>
                <div className="items-list">
                  {order.items.map(item => (
                    <div key={item.id} className="item">
                      <span className="item-name">{item.product.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                      <span className="item-price">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="payment-info">
                <p><strong>Payment:</strong> {order.payment?.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Paid'}</p>
                <p><strong>Payment Status:</strong> 
                  <span className={`payment-status ${order.payment?.payment_status}`}>
                    {order.payment?.payment_status === 'yet_to_pay' ? 'Collect Payment' : 'Paid'}
                  </span>
                </p>
              </div>

              <div className="order-actions">
                {order.status === 'assigned' && (
                  <button 
                    className="action-btn start-delivery"
                    onClick={() => handleStatusUpdate(order.id, 'on_the_way')}
                  >
                    Start Delivery
                  </button>
                )}
                
                {order.status === 'on_the_way' && (
                  <button 
                    className="action-btn mark-delivered"
                    onClick={() => handleStatusUpdate(order.id, 'delivered')}
                  >
                    Mark as Delivered
                  </button>
                )}

                {/* ✅ Add collect payment button for COD orders */}
                {order.payment?.payment_method === 'cash_on_delivery' && 
                 order.payment?.payment_status === 'yet_to_pay' && (
                  <button 
                    className="action-btn collect-payment"
                    onClick={() => handleCollectPayment(order.id)}
                  >
                    Collect Payment
                  </button>
                )}
              </div>

              <div className="order-date">
                <small>Order Date: {new Date(order.created_at).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;