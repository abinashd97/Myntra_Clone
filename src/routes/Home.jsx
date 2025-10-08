import HomeItem from "../components/HomeItem";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const items = useSelector((store) => store.items);
  const auth = useSelector((store) => store.auth);
  
  // If user is not authenticated, redirect to login page
  if (!auth.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  console.log('Home component - items from store:', items);
  console.log('Home component - items count:', items.length);

  return (
    <main>
      <div className="items-container">
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', fontSize: '18px', color: '#666' }}>
            No items found. Please check if the backend is running.
          </div>
        ) : (
          items.map((item) => (
            <HomeItem key={item.id} item={item} />
          ))
        )}
      </div>
    </main>
  );
};

export default Home;
