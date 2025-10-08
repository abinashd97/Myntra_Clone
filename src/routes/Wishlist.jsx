import { useSelector, useDispatch } from "react-redux";
import { wishlistActions } from "../store/wishlistSlice";
import { bagActions } from "../store/bagSlice";
import { GrAddCircle } from "react-icons/gr";
import { AiFillDelete } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";

const Wishlist = () => {
  const wishlist = useSelector((store) => store.wishlist);
  const items = useSelector((store) => store.items);
  const bag = useSelector((store) => store.bag);
  const dispatch = useDispatch();

  // Get wishlist items with full details
  const wishlistItems = items.filter(item => wishlist.includes(item.id));

  const handleRemoveFromWishlist = (itemId) => {
    dispatch(wishlistActions.removeFromWishlist(itemId));
  };

  const handleAddToBag = (itemId) => {
    dispatch(bagActions.addToBag(itemId));
  };

  const handleRemoveFromBag = (itemId) => {
    dispatch(bagActions.removeFromBag(itemId));
  };

  const isInBag = (itemId) => {
    return bag.includes(itemId);
  };

  return (
    <main>
      <div className="wishlist-container">
        <h2 className="wishlist-title">My Wishlist ({wishlistItems.length})</h2>
        
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <FaHeart className="empty-heart" />
            <h3>Your wishlist is empty</h3>
            <p>Add items to your wishlist to see them here</p>
          </div>
        ) : (
          <div className="wishlist-items">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="item-image-container">
                  <img className="item-image" src={item.image} alt="item image" />
                  <button
                    className="remove-wishlist-btn"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    title="Remove from Wishlist"
                  >
                    <FaHeart className="heart-filled" />
                  </button>
                </div>
                
                <div className="item-details">
                  <div className="rating">
                    {item.rating.stars} ⭐ | {item.rating.count}
                  </div>
                  <div className="company-name">{item.company}</div>
                  <div className="item-name">{item.item_name}</div>
                  <div className="category">{item.category}</div>
                  <div className="price">
                    <span className="current-price">Rs {item.current_price}</span>
                    <span className="original-price">Rs {item.original_price}</span>
                    <span className="discount">({item.discount_percentage}% OFF)</span>
                  </div>
                </div>

                <div className="item-actions">
                  {isInBag(item.id) ? (
                    <button
                      type="button"
                      className="btn btn-add-bag btn-danger"
                      onClick={() => handleRemoveFromBag(item.id)}
                    >
                      <AiFillDelete /> Remove from Bag
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-add-bag btn-success"
                      onClick={() => handleAddToBag(item.id)}
                    >
                      <GrAddCircle /> Add to Bag
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
