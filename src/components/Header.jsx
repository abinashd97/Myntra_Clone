import { BsFillPersonFill } from "react-icons/bs";
import { FaFaceGrinHearts, FaBagShopping } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { authActions } from "../store/authSlice";
import { itemsActions } from "../store/itemsSlice";

const Header = () => {
  const bag = useSelector((store) => store.bag);
  const wishlist = useSelector((store) => store.wishlist);
  const auth = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef(null);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const searchRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search functionality
  const fetchAllItems = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/items');
      
      if (response.ok) {
        const items = await response.json();
        
        // Transform backend data to match frontend format
        const transformedItems = items.map(item => ({
          id: item.id,
          image: item.image,
          company: item.company,
          item_name: item.itemName,
          current_price: item.currentPrice,
          original_price: item.originalPrice,
          discount_percentage: item.discountPercentage,
          rating: { 
            stars: item.ratingStars, 
            count: item.ratingCount 
          },
          category: item.category
        }));

        // Update the items in the store with all items
        dispatch(itemsActions.addInitialItems(transformedItems));
        setActiveCategory(null); // Clear active category when showing all items
      }
    } catch (error) {
      console.error('Error fetching all items:', error);
    }
  };

  const fetchSearchSuggestions = async (query) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`http://localhost:8080/api/items/search/suggestions?query=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const suggestions = await response.json();
        setSearchSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
      } else {
        setSearchSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      setSearchSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // If search is cleared, restore all items
    if (query.trim() === "") {
      setShowSuggestions(false);
      setSearchSuggestions([]);
      // Fetch all items from backend
      fetchAllItems();
    } else {
      fetchSearchSuggestions(query);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        const response = await fetch(`http://localhost:8080/api/items/search?query=${encodeURIComponent(searchQuery)}`);
        
        if (response.ok) {
          const items = await response.json();
          
          // Transform backend data to match frontend format
          const transformedItems = items.map(item => ({
            id: item.id,
            image: item.image,
            company: item.company,
            item_name: item.itemName,
            current_price: item.currentPrice,
            original_price: item.originalPrice,
            discount_percentage: item.discountPercentage,
            rating: { 
              stars: item.ratingStars, 
              count: item.ratingCount 
            },
            category: item.category
          }));

          // Update the items in the store with search results
          dispatch(itemsActions.addInitialItems(transformedItems));
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error searching items:', error);
      }
    }
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    
    // Search for the exact item name using the new exact search endpoint
    try {
      const response = await fetch(`http://localhost:8080/api/items/search/exact?itemName=${encodeURIComponent(suggestion)}`);
      
      if (response.ok) {
        const items = await response.json();
        
        // Transform backend data to match frontend format
        const transformedItems = items.map(item => ({
          id: item.id,
          image: item.image,
          company: item.company,
          item_name: item.itemName,
          current_price: item.currentPrice,
          original_price: item.originalPrice,
          discount_percentage: item.discountPercentage,
          rating: { 
            stars: item.ratingStars, 
            count: item.ratingCount 
          },
          category: item.category
        }));

        // Update the items in the store with exact match results
        dispatch(itemsActions.addInitialItems(transformedItems));
        console.log('Exact search results for "' + suggestion + '":', transformedItems.length, 'items');
      }
    } catch (error) {
      console.error('Error searching for exact item:', error);
    }
  };

  const handleCategoryClick = async (category) => {
    console.log('Category clicked:', category);
    try {
      const response = await fetch(`http://localhost:8080/api/items/category/${encodeURIComponent(category)}`);
      console.log('Category API response:', response.status);
      
      if (response.ok) {
        const items = await response.json();
        console.log('Category items received:', items);
        
        // Transform backend data to match frontend format
        const transformedItems = items.map(item => ({
          id: item.id,
          image: item.image,
          company: item.company,
          item_name: item.itemName,
          current_price: item.currentPrice,
          original_price: item.originalPrice,
          discount_percentage: item.discountPercentage,
          rating: { 
            stars: item.ratingStars, 
            count: item.ratingCount 
          },
          category: item.category
        }));

        console.log('Transformed category items:', transformedItems);
        // Update the items in the store with category results
        dispatch(itemsActions.addInitialItems(transformedItems));
        setSearchQuery(""); // Clear search when switching categories
        setActiveCategory(category); // Set active category
        console.log('Items updated in store for category:', category);
      } else {
        console.error('Failed to fetch category items:', response.status);
      }
    } catch (error) {
      console.error('Error fetching category items:', error);
    }
  };

  const handleLogoClick = async () => {
    console.log('Logo clicked - fetching all items');
    try {
      const response = await fetch('http://localhost:8080/api/items');
      console.log('All items API response:', response.status);
      
      if (response.ok) {
        const items = await response.json();
        console.log('All items received:', items);
        
        // Transform backend data to match frontend format
        const transformedItems = items.map(item => ({
          id: item.id,
          image: item.image,
          company: item.company,
          item_name: item.itemName,
          current_price: item.currentPrice,
          original_price: item.originalPrice,
          discount_percentage: item.discountPercentage,
          rating: { 
            stars: item.ratingStars, 
            count: item.ratingCount 
          },
          category: item.category
        }));

        console.log('Transformed all items:', transformedItems);
        // Update the items in the store with all items
        dispatch(itemsActions.addInitialItems(transformedItems));
        setSearchQuery(""); // Clear search
        setActiveCategory(null); // Clear active category
        console.log('All items updated in store');
        
        // Navigate to home page
        navigate('/');
      } else {
        console.error('Failed to fetch all items:', response.status);
      }
    } catch (error) {
      console.error('Error fetching all items:', error);
    }
  };

  return (
    <header>
      <div className="logo_container">
        <div 
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }}
        >
          <img
            className="myntra_home"
            src="/images/myntra_logo.webp"
            alt="Myntra Home"
          />
        </div>
      </div>
      <nav className="nav_bar">
        <a 
          href="#" 
          className={activeCategory === "Men" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); handleCategoryClick("Men"); }}
        >
          Men
        </a>
        <a 
          href="#" 
          className={activeCategory === "Women" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); handleCategoryClick("Women"); }}
        >
          Women
        </a>
        <a 
          href="#" 
          className={activeCategory === "Kids" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); handleCategoryClick("Kids"); }}
        >
          Kids
        </a>
        <a 
          href="#" 
          className={activeCategory === "Home & Living" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); handleCategoryClick("Home & Living"); }}
        >
          Home & Living
        </a>
        <a 
          href="#" 
          className={activeCategory === "Beauty" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); handleCategoryClick("Beauty"); }}
        >
          Beauty
        </a>
        <a 
          href="#" 
          className={activeCategory === "Studio" ? "active" : ""}
          onClick={(e) => { e.preventDefault(); handleCategoryClick("Studio"); }}
        >
          Studio <sup>New</sup>
        </a>
      </nav>
      <div className="search_bar" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', width: '100%' }}>
          <span className="material-symbols-outlined search_icon">search</span>
          <input
            className="search_input"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
          />
        </form>
        
        {/* Search Suggestions Dropdown */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="search-suggestions">
            {isSearching ? (
              <div className="suggestion-item">Searching...</div>
            ) : (
              searchSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="action_bar">
        {auth.isAuthenticated ? (
          <div className="profile-dropdown" ref={profileRef}>
            <div 
              className="action_container"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{ cursor: 'pointer' }}
            >
              <BsFillPersonFill />
              <span className="action_name">{auth.user.name}</span>
            </div>
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-item">
                  <strong>{auth.user.name}</strong>
                </div>
                <div className="profile-menu-item">
                  {auth.user.email}
                </div>
                <Link 
                  className="profile-menu-item" 
                  to="/orders"
                  onClick={() => setShowProfileMenu(false)}
                >
                  My Orders
                </Link>
                <Link 
                  className="profile-menu-item" 
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                >
                  My Account
                </Link>
                <div 
                  className="profile-menu-item logout"
                  onClick={() => {
                    dispatch(authActions.logout());
                    setShowProfileMenu(false);
                    navigate('/auth');
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link className="action_container" to="/auth">
            <BsFillPersonFill />
            <span className="action_name">Profile</span>
          </Link>
        )}

        <Link className="action_container" to="/wishlist">
          <FaFaceGrinHearts />
          <span className="action_name">Wishlist</span>
          <span className="wishlist-item-count">{wishlist.length}</span>
        </Link>

        <Link className="action_container" to="/bag">
          <FaBagShopping />
          <span className="action_name">Bag</span>
          <span className="bag-item-count">{bag.length}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
