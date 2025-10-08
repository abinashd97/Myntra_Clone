import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaPlus, FaTrash, FaHome, FaBriefcase, FaMapMarkerAlt } from "react-icons/fa";

const UserProfile = () => {
  const auth = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "HOME",
    isDefault: false
  });

  useEffect(() => {
    fetchUserProfile();
    fetchAddresses();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please login to view your profile");
        setLoading(false);
        navigate('/auth');
        return;
      }

      const response = await fetch('http://localhost:8080/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setProfileForm({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || ""
        });
      } else if (response.status === 401) {
        setError("Please login to view your profile");
        localStorage.removeItem('token');
        navigate('/auth');
      } else {
        setError("Failed to fetch user profile");
      }
    } catch (error) {
      setError("Error fetching user profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      const response = await fetch('http://localhost:8080/api/user/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const addressesData = await response.json();
        setAddresses(addressesData);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditingProfile(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData || "Failed to update profile");
      }
    } catch (error) {
      setError("Error updating profile");
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/user/addresses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        await fetchAddresses();
        setShowAddAddress(false);
        setAddressForm({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          addressType: "HOME",
          isDefault: false
        });
        setSuccess("Address added successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData || "Failed to add address");
      }
    } catch (error) {
      setError("Error adding address");
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/user/addresses/${editingAddress.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      });

      if (response.ok) {
        await fetchAddresses();
        setEditingAddress(null);
        setAddressForm({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          pincode: "",
          addressType: "HOME",
          isDefault: false
        });
        setSuccess("Address updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData || "Failed to update address");
      }
    } catch (error) {
      setError("Error updating address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/user/addresses/${addressId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          await fetchAddresses();
          setSuccess("Address deleted successfully!");
          setTimeout(() => setSuccess(""), 3000);
        } else {
          setError("Failed to delete address");
        }
      } catch (error) {
        setError("Error deleting address");
      }
    }
  };

  const startEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      addressType: address.addressType,
      isDefault: address.isDefault
    });
  };

  const getAddressTypeIcon = (type) => {
    switch (type) {
      case "HOME": return <FaHome />;
      case "WORK": return <FaBriefcase />;
      default: return <FaMapMarkerAlt />;
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error && error.includes("login")) {
    return (
      <main className="user-profile-container">
        <div className="profile-header">
          <h2>My Account</h2>
          <div className="error-message">
            {error}
            <br />
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/auth')}
              style={{ marginTop: '10px' }}
            >
              Go to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="user-profile-container">
      <div className="profile-header">
        <h2>My Account</h2>
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="section-header">
          <h3>Personal Information</h3>
          {!editingProfile && (
            <button 
              className="edit-btn"
              onClick={() => setEditingProfile(true)}
            >
              <FaEdit /> Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <form onSubmit={handleProfileUpdate} className="profile-form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save Changes</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setEditingProfile(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <div className="info-item">
              <strong>Name:</strong> {user?.name}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {user?.email}
            </div>
            <div className="info-item">
              <strong>Phone:</strong> {user?.phone || "Not provided"}
            </div>
          </div>
        )}
      </div>

      {/* Addresses Section */}
      <div className="addresses-section">
        <div className="section-header">
          <h3>My Addresses ({addresses.length})</h3>
          <button 
            className="add-btn"
            onClick={() => setShowAddAddress(true)}
          >
            <FaPlus /> Add Address
          </button>
        </div>

        {/* Add/Edit Address Form */}
        {(showAddAddress || editingAddress) && (
          <form 
            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} 
            className="address-form"
          >
            <h4>{editingAddress ? "Edit Address" : "Add New Address"}</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Address Line 1</label>
              <input
                type="text"
                value={addressForm.addressLine1}
                onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Address Line 2</label>
              <input
                type="text"
                value={addressForm.addressLine2}
                onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={addressForm.pincode}
                  onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                  required
                  maxLength="6"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Address Type</label>
                <select
                  value={addressForm.addressType}
                  onChange={(e) => setAddressForm({...addressForm, addressType: e.target.value})}
                >
                  <option value="HOME">Home</option>
                  <option value="WORK">Work</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                  />
                  Set as default address
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingAddress ? "Update Address" : "Add Address"}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddAddress(false);
                  setEditingAddress(null);
                  setAddressForm({
                    fullName: "",
                    phone: "",
                    addressLine1: "",
                    addressLine2: "",
                    city: "",
                    state: "",
                    pincode: "",
                    addressType: "HOME",
                    isDefault: false
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Addresses List */}
        <div className="addresses-list">
          {addresses.length === 0 ? (
            <div className="empty-addresses">
              <FaMapMarkerAlt className="empty-icon" />
              <p>No addresses added yet</p>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
                <div className="address-header">
                  <div className="address-type">
                    {getAddressTypeIcon(address.addressType)}
                    <span>{address.addressType}</span>
                    {address.isDefault && <span className="default-badge">Default</span>}
                  </div>
                  <div className="address-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => startEditAddress(address)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="address-details">
                  <div className="address-name">{address.fullName}</div>
                  <div className="address-phone">{address.phone}</div>
                  <div className="address-lines">
                    <div>{address.addressLine1}</div>
                    {address.addressLine2 && <div>{address.addressLine2}</div>}
                    <div>{address.city}, {address.state} - {address.pincode}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
