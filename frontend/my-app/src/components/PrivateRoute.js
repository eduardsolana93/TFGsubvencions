import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, children }) => {
  //  const location = useLocation();
  //  const adminRoutes = ["/register", "/subvencions"];
  //  const currentPath = location.pathname;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

/*    if (adminRoutes.includes(currentPath) && !isAdmin) {
        return <Navigate to="/login" />;
    }
    */
    return children;
};

export default PrivateRoute;
