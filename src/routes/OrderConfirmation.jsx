import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaShoppingBag, FaHome } from "react-icons/fa";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrder(orderData);
      } else {
        setError("Failed to fetch order details");
      }
    } catch (error) {
      setError("Error fetching order details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="order-confirmation-container">
        <div className="loading">Loading order details...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="order-confirmation-container">
        <div className="error-message">{error}</div>
      </main>
    );
  }

  return (
    <main className="order-confirmation-container">
      <div className="confirmation-content">
        {/* Success Icon and Message */}
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
        </div>

        {/* Order Details */}
        {order && (
          <div className="order-details">
            <div className="order-info">
              <h3>Order Details</h3>
              <div className="info-row">
                <span>Order Number:</span>
                <span className="order-number">{order.orderNumber}</span>
              </div>
              <div className="info-row">
                <span>Order Date:</span>
                <span>{new Date(order.orderDate).toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <span>Total Amount:</span>
                <span className="total-amount">Rs {order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="info-row">
                <span>Payment Method:</span>
                <span>{order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span className="status confirmed">{order.status}</span>
              </div>
            </div>

            <div className="delivery-info">
              <h3>Delivery Address</h3>
              <div className="address-text">
                {order.deliveryAddress}
              </div>
            </div>

            {order.orderItems && order.orderItems.length > 0 && (
              <div className="order-items">
                <h3>Order Items</h3>
                <div className="items-list">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="order-item">
                      <img src={`/${item.itemImage}`} alt={item.itemName} className="item-image" />
                      <div className="item-details">
                        <div className="item-name">{item.itemName}</div>
                        <div className="item-company">{item.company}</div>
                        <div className="item-quantity">Quantity: {item.quantity}</div>
                        <div className="item-price">Rs {item.totalPrice.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/orders')}
          >
            <FaShoppingBag /> View My Orders
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            <FaHome /> Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <h4>What's Next?</h4>
          <ul>
            <li>You'll receive an order confirmation email shortly</li>
            <li>We'll notify you when your order is shipped</li>
            <li>Track your order in "My Orders" section</li>
            <li>Expected delivery: 3-5 business days</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default OrderConfirmation;
