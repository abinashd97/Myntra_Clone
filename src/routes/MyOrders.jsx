import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingBag, FaMapMarkerAlt, FaCalendarAlt, FaRupeeSign } from "react-icons/fa";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch('http://localhost:8080/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <main className="my-orders-container">
        <div className="loading">Loading your orders...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="my-orders-container">
        <div className="error-message">{error}</div>
      </main>
    );
  }

  return (
    <main className="my-orders-container">
      <div className="orders-header">
        <h2>
          <FaShoppingBag /> My Orders
        </h2>
        <p>Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <FaShoppingBag className="no-orders-icon" />
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-number">
                    Order #{order.orderNumber}
                  </div>
                  <div className="order-date">
                    <FaCalendarAlt /> {formatDate(order.orderDate)}
                  </div>
                </div>
                <div className="order-status">
                  <span className={`status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="order-details">
                <div className="order-amount">
                  <FaRupeeSign /> {order.totalAmount.toFixed(2)}
                </div>
                <div className="payment-method">
                  Payment: {order.paymentMethod.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="delivery-address">
                <FaMapMarkerAlt />
                <span>{order.deliveryAddress}</span>
              </div>

              {order.orderItems && order.orderItems.length > 0 && (
                <div className="order-items">
                  <h4>Items ({order.orderItems.length})</h4>
                  <div className="items-preview">
                    {order.orderItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="item-preview">
                        <img src={`/${item.itemImage}`} alt={item.itemName} className="item-image" />
                        <div className="item-info">
                          <div className="item-name">{item.itemName}</div>
                          <div className="item-company">{item.company}</div>
                          <div className="item-quantity">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                    {order.orderItems.length > 3 && (
                      <div className="more-items">
                        +{order.orderItems.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="order-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate(`/order-confirmation/${order.id}`)}
                >
                  View Details
                </button>
                {order.status.toLowerCase() === 'delivered' && (
                  <button className="btn btn-primary">
                    Reorder
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyOrders;
