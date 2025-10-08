import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { bagActions } from "../store/bagSlice";
import { FaMapMarkerAlt, FaCreditCard, FaArrowRight } from "react-icons/fa";

const OrderSummary = () => {
  const bag = useSelector((store) => store.bag);
  const items = useSelector((store) => store.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [bagItems, setBagItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get bag items with full details
    const bagItemsWithDetails = items.filter(item => bag.includes(item.id));
    setBagItems(bagItemsWithDetails);
    
    // Calculate total amount
    const total = bagItemsWithDetails.reduce((sum, item) => sum + item.current_price, 0);
    setTotalAmount(total);
    
    // Fetch user addresses
    fetchAddresses();
  }, [bag, items]);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:8080/api/user/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const addressesData = await response.json();
        setAddresses(addressesData);
        // Set default address if available
        const defaultAddress = addressesData.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      // Prepare order data
      const orderData = {
        items: bag.map(itemId => ({
          itemId: itemId,
          quantity: 1 // For now, assuming quantity 1 for each item
        })),
        deliveryAddress: formatAddress(selectedAddress),
        paymentMethod: paymentMethod,
        totalAmount: totalAmount
      };


      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const order = await response.json();
        // Clear the bag
        dispatch(bagActions.clearBag());
        // Navigate to order confirmation
        navigate(`/order-confirmation/${order.id}`);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        setError(`Failed to place order: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      setError("Error placing order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.fullName}, ${address.phone}, ${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state} - ${address.pincode}`;
  };

  if (bagItems.length === 0) {
    return (
      <main className="order-summary-container">
        <div className="empty-bag">
          <h2>Your bag is empty</h2>
          <p>Add some items to your bag to place an order</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="order-summary-container">
      <div className="order-header">
        <h2>Order Summary</h2>
        <p>Review your order details before placing the order</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="order-content">
        {/* Order Items */}
        <div className="order-section">
          <h3>Order Items ({bagItems.length})</h3>
          <div className="order-items">
            {bagItems.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.item_name} className="item-image" />
                <div className="item-details">
                  <div className="item-name">{item.item_name}</div>
                  <div className="item-company">{item.company}</div>
                  <div className="item-price">Rs {item.current_price}</div>
                </div>
                <div className="item-quantity">Qty: 1</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="order-section">
          <h3>
            <FaMapMarkerAlt /> Delivery Address
          </h3>
          {addresses.length === 0 ? (
            <div className="no-address">
              <p>No addresses found. Please add an address in your profile.</p>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/profile')}
              >
                Add Address
              </button>
            </div>
          ) : (
            <div className="address-selection">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`address-option ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className="address-type">{address.addressType}</div>
                  <div className="address-details">
                    <div className="address-name">{address.fullName}</div>
                    <div className="address-phone">{address.phone}</div>
                    <div className="address-lines">
                      {address.addressLine1}
                      {address.addressLine2 && <div>{address.addressLine2}</div>}
                      <div>{address.city}, {address.state} - {address.pincode}</div>
                    </div>
                  </div>
                  {address.isDefault && <div className="default-badge">Default</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="order-section">
          <h3>
            <FaCreditCard /> Payment Method
          </h3>
          <div className="payment-methods">
            <div 
              className={`payment-option ${paymentMethod === 'credit_card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('credit_card')}
            >
              <input 
                type="radio" 
                name="payment" 
                value="credit_card" 
                checked={paymentMethod === 'credit_card'}
                onChange={() => setPaymentMethod('credit_card')}
              />
              <label>Credit Card</label>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'debit_card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('debit_card')}
            >
              <input 
                type="radio" 
                name="payment" 
                value="debit_card" 
                checked={paymentMethod === 'debit_card'}
                onChange={() => setPaymentMethod('debit_card')}
              />
              <label>Debit Card</label>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('upi')}
            >
              <input 
                type="radio" 
                name="payment" 
                value="upi" 
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
              />
              <label>UPI</label>
            </div>
            <div 
              className={`payment-option ${paymentMethod === 'net_banking' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('net_banking')}
            >
              <input 
                type="radio" 
                name="payment" 
                value="net_banking" 
                checked={paymentMethod === 'net_banking'}
                onChange={() => setPaymentMethod('net_banking')}
              />
              <label>Net Banking</label>
            </div>
          </div>
        </div>

        {/* Order Total */}
        <div className="order-total">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>Rs {totalAmount.toFixed(2)}</span>
          </div>
          <div className="total-row">
            <span>Delivery:</span>
            <span>FREE</span>
          </div>
          <div className="total-row total">
            <span>Total:</span>
            <span>Rs {totalAmount.toFixed(2)}</span>
          </div>
        </div>

        {/* Place Order Button */}
        <div className="order-actions">
          <button 
            className="btn btn-primary place-order-btn"
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddress}
          >
            {loading ? "Placing Order..." : "Place Order"}
            <FaArrowRight />
          </button>
        </div>
      </div>
    </main>
  );
};

export default OrderSummary;
