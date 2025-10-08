import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { itemsActions } from "../store/itemsSlice";
import { fetchStatusActions } from "../store/fetchStatusSlice";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    dispatch(fetchStatusActions.markFetchingStarted());
    setError(null);
    
    // Fetch items from backend API
    const fetchItemsFromAPI = async () => {
      try {
        console.log('Fetching items from backend API...');
        const response = await fetch('http://localhost:8080/api/items');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const items = await response.json();
        console.log('Items received from API:', items);
        
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

        console.log('Transformed items:', transformedItems);
        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
        dispatch(itemsActions.addInitialItems(transformedItems));
        
      } catch (error) {
        console.error('Error fetching items from backend:', error);
        setError(error.message);
        dispatch(fetchStatusActions.markFetchingFinished());
        // Don't mark as done so user can retry
      }
    };

    fetchItemsFromAPI();
  }, [fetchStatus, dispatch]);

  // Show error message if API call failed
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        backgroundColor: '#ffebee', 
        border: '1px solid #f44336', 
        borderRadius: '4px',
        margin: '20px',
        color: '#c62828'
      }}>
        <h3>Failed to load items from backend</h3>
        <p><strong>Error:</strong> {error}</p>
        <p>Please make sure the backend server is running on http://localhost:8080</p>
        <button 
          onClick={() => {
            setError(null);
            dispatch(fetchStatusActions.markFetchingFinished());
            // Reset fetch status to allow retry
            window.location.reload();
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return <></>;
};

export default FetchItems;
