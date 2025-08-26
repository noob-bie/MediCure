import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./OrderManagement.css";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDeliveryman, setSelectedDeliveryman] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params = filterStatus ? { status: filterStatus } : {};
        const response = await axiosInstance.get("/admin/orders", { params });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDeliverymen = async () => {
      try {
        const response = await axiosInstance.get("/admin/deliverymen");
        setDeliverymen(response.data);
      } catch (error) {
        console.error("Error fetching deliverymen:", error);
      }
    };

    fetchOrders();
    fetchDeliverymen();
  }, [filterStatus]);

  // Separate function for refreshing orders (used after updates)
  const refreshOrders = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await axiosInstance.get("/admin/orders", { params });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDeliveryman = async () => {
    if (!selectedDeliveryman || !selectedOrder) return;

    try {
      await axiosInstance.put(`/admin/orders/${selectedOrder.id}/assign`, {
        deliveryman_id: selectedDeliveryman,
      });

      setAssignModalOpen(false);
      setSelectedDeliveryman("");
      setSelectedOrder(null);
      refreshOrders(); // Use refreshOrders instead of fetchOrders
      alert("Deliveryman assigned successfully!");
    } catch (error) {
      console.error("Error assigning deliveryman:", error);
      alert("Failed to assign deliveryman");
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/admin/orders/${orderId}/status`, {
        status: newStatus,
      });
      refreshOrders(); // Use refreshOrders instead of fetchOrders
      alert("Order status updated successfully!");
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      assigned: "status-assigned",
      on_the_way: "status-on-way",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };

    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h2>Order Management</h2>
        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="assigned">Assigned</option>
            <option value="on_the_way">On The Way</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Deliveryman</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
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
                  <div className="order-items">
                    {order.items.slice(0, 2).map((item) => (
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
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  {order.deliveryman ? (
                    <div>
                      <strong>{order.deliveryman.name}</strong>
                      <br />
                      <small>{order.deliveryman.phone}</small>
                    </div>
                  ) : (
                    <span className="no-deliveryman">Not assigned</span>
                  )}
                </td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {!order.deliveryman && order.status === "confirmed" && (
                      <button
                        className="assign-btn"
                        onClick={() => {
                          setSelectedOrder(order);
                          setAssignModalOpen(true);
                        }}
                      >
                        Assign
                      </button>
                    )}

                    <select
                      className="status-select"
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="assigned">Assigned</option>
                      <option value="on_the_way">On The Way</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Assign Deliveryman Modal */}
      {assignModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Assign Deliveryman</h3>
            <div className="modal-content">
              <p>
                <strong>Order:</strong> #{selectedOrder?.id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedOrder?.user.name}
              </p>
              <p>
                <strong>Total:</strong> ৳{selectedOrder?.total_price}
              </p>

              <div className="form-group">
                <label>Select Deliveryman:</label>
                <select
                  value={selectedDeliveryman}
                  onChange={(e) => setSelectedDeliveryman(e.target.value)}
                  className="deliveryman-select"
                >
                  <option value="">Choose deliveryman...</option>
                  {deliverymen.map((deliveryman) => (
                    <option key={deliveryman.id} value={deliveryman.id}>
                      {deliveryman.name} - {deliveryman.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => {
                  setAssignModalOpen(false);
                  setSelectedDeliveryman("");
                  setSelectedOrder(null);
                }}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={handleAssignDeliveryman}
                disabled={!selectedDeliveryman}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManagement;
