import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const PrivateRoute: React.FC<{
  children: React.ReactNode;
  adminOnly?: boolean;
}> = ({ children, adminOnly }) => {
  const { isAdmin } = useAuth();

  // console.log("PrivateRoute - isAuthenticated:", isAuthenticated);
  console.log("PrivateRoute - isAdmin:", isAdmin);

  if (localStorage.getItem("isAuthenticated") == "false") {
    console.log(localStorage.getItem("isAuthenticated"));
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
