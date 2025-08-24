import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import './PaymentDetails.css';

const PaymentDetails = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalCollected: 0,
    pendingCollection: 0,
    totalOrders: 0
  });

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      // We'll use the delivery history endpoint and process payment data
      const response = await axiosInstance.get('/delivery/history');
      const allOrders = response.data;
      
      // Get current orders too for pending payments
      const currentResponse = await axiosInstance.get('/delivery/my-orders');
      const currentOrders = currentResponse.data;
      
      const allOrdersData = [...allOrders, ...currentOrders];
      
      // Calculate payment summary
      const totalCollected = allOrders
        .filter(order => order.payment?.payment_status === 'paid')
        .reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      
      const pendingCollection = allOrdersData
        .filter(order => order.payment?.payment_status === 'yet_to_pay')
        .reduce((sum, order) => sum + parseFloat(order.total_price), 0);
      
      setSummary({
        totalCollected,
        pendingCollection,
        totalOrders: allOrdersData.length
      });
      
      setPaymentData(allOrdersData);
    } catch (error) {
      console.error('Error fetching payment details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading payment details...</div>;
  }

  return (
    <div className="payment-details">
      <div className="page-header">
        <h2>Payment Details</h2>
        <p>Track your payment collections and pending amounts</p>
      </div>

      <div className="payment-summary">
        <div className="summary-card collected">
          <h3>Total Collected</h3>
          <div className="amount">৳{summary.totalCollected.toFixed(2)}</div>
        </div>
        <div className="summary-card pending">
          <h3>Pending Collection</h3>
          <div className="amount">৳{summary.pendingCollection.toFixed(2)}</div>
        </div>
        <div className="summary-card orders">
          <h3>Total Orders</h3>
          <div className="amount">{summary.totalOrders}</div>
        </div>
      </div>

      <div className="payment-table-container">
        <h3>Payment History</h3>
        <table className="payment-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Value</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentData.map(order => (
              <tr key={order.id} className={order.payment?.payment_status === 'yet_to_pay' ? 'pending-payment' : ''}>
                <td>#{order.id}</td>
                <td>
                  <div>
                    <strong>{order.user.name}</strong>
                    <br />
                    <small>{order.user.phone}</small>
                  </div>
                </td>
                <td>৳{order.total_price}</td>
                <td>
                  <span className="payment-method">
                    {order.payment?.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </td>
                <td>
                  <span className={`payment-status-badge ${order.payment?.payment_status}`}>
                    {order.payment?.payment_status === 'yet_to_pay' ? 'Collect Cash' : 'Collected'}
                  </span>
                </td>
                <td>
                  <span className={`order-status-badge ${order.status}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </td>
                <td>
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentDetails;