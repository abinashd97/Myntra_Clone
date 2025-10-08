import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((store) => store.auth);

  // If user is not authenticated, redirect to login page
  if (!auth.isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If user is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
