import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { itemsActions } from "../store/itemsSlice";
import { fetchStatusActions } from "../store/fetchStatusSlice";

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus.fetchDone) return;

    dispatch(fetchStatusActions.markFetchingStarted());
    
    // Mock data since no backend server is running
    const mockItems = [
      {
        id: 1,
        image: "images/1.jpg",
        company: "Nike",
        item_name: "Air Max 270",
        current_price: 12999,
        original_price: 15999,
        discount_percentage: 19,
        rating: { stars: 4.5, count: 120 }
      },
      {
        id: 2,
        image: "images/2.jpg",
        company: "Adidas",
        item_name: "Ultraboost 22",
        current_price: 18999,
        original_price: 21999,
        discount_percentage: 14,
        rating: { stars: 4.3, count: 89 }
      },
      {
        id: 3,
        image: "images/3.jpg",
        company: "Puma",
        item_name: "RS-X Reinvention",
        current_price: 8999,
        original_price: 11999,
        discount_percentage: 25,
        rating: { stars: 4.1, count: 67 }
      },
      {
        id: 4,
        image: "images/4.jpg",
        company: "Reebok",
        item_name: "Classic Leather",
        current_price: 5999,
        original_price: 7999,
        discount_percentage: 25,
        rating: { stars: 4.4, count: 156 }
      },
      {
        id: 5,
        image: "images/5.jpg",
        company: "Converse",
        item_name: "Chuck Taylor All Star",
        current_price: 3999,
        original_price: 4999,
        discount_percentage: 20,
        rating: { stars: 4.6, count: 234 }
      },
      {
        id: 6,
        image: "images/6.jpg",
        company: "Vans",
        item_name: "Old Skool",
        current_price: 4999,
        original_price: 6499,
        discount_percentage: 23,
        rating: { stars: 4.2, count: 98 }
      },
      {
        id: 7,
        image: "images/7.jpg",
        company: "New Balance",
        item_name: "574 Core",
        current_price: 7999,
        original_price: 9999,
        discount_percentage: 20,
        rating: { stars: 4.3, count: 112 }
      },
      {
        id: 8,
        image: "images/8.jpg",
        company: "Fila",
        item_name: "Disruptor II",
        current_price: 6999,
        original_price: 8999,
        discount_percentage: 22,
        rating: { stars: 4.0, count: 76 }
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      dispatch(fetchStatusActions.markFetchDone());
      dispatch(fetchStatusActions.markFetchingFinished());
      dispatch(itemsActions.addInitialItems(mockItems));
    }, 1000);
  }, [fetchStatus, dispatch]);

  return <></>;
};

export default FetchItems;
