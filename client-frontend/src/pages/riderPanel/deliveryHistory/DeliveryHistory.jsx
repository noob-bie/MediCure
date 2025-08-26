import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import './DeliveryHistory.css';

const DeliveryHistory = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalEarnings: 0,
    thisMonth: 0
  });

  useEffect(() => {
    fetchDeliveryHistory();
  }, []);

  const fetchDeliveryHistory = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/delivery/history');
      const orders = response.data;
      setDeliveredOrders(orders);
      
      // Calculate stats
      const totalDeliveries = orders.length;
      const totalEarnings = orders.reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const thisMonth = orders.filter(order => {
        const orderDate = new Date(order.updated_at);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      }).length;
      
      setStats({ totalDeliveries, totalEarnings, thisMonth });
    } catch (error) {
      console.error('Error fetching delivery history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading delivery history...</div>;
  }

  return (
    <div className="delivery-history">
      <div className="page-header">
        <h2>Delivery History</h2>
        <p>Your completed deliveries and performance stats</p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <h3>Total Deliveries</h3>
          <div className="stat-number">{stats.totalDeliveries}</div>
        </div>
        <div className="stat-card">
          <h3>Total Orders Value</h3>
          <div className="stat-number">৳{stats.totalEarnings.toFixed(2)}</div>
        </div>
        <div className="stat-card">
          <h3>This Month</h3>
          <div className="stat-number">{stats.thisMonth}</div>
        </div>
      </div>

      {deliveredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No delivery history found.</p>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total Value</th>
                <th>Payment Method</th>
                <th>Delivered Date</th>
              </tr>
            </thead>
            <tbody>
              {deliveredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <div>
                      <strong>{order.user.name}</strong>
                      <br />
                      <small>{order.user.phone}</small>
                    </div>
                  </td>
                  <td>
                    <div className="order-items-summary">
                      {order.items.slice(0, 2).map(item => (
                        <div key={item.id} className="item-summary">
                          {item.product.name} x{item.quantity}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <small>+{order.items.length - 2} more items</small>
                      )}
                    </div>
                  </td>
                  <td>৳{order.total_price}</td>
                  <td>
                    <span className="payment-method">
                      {order.payment?.payment_method === 'cash_on_delivery' ? 'COD' : 'Online'}
                    </span>
                  </td>
                  <td>
                    {new Date(order.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeliveryHistory;