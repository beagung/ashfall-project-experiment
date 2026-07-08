import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user'));

  // 1. Cek apakah ada token
  if (!token) {
    return <Navigate to="/login-admin" replace />;
  }

  // 2. Cek apakah role sesuai (admin atau customer)
  if (allowedRole && userData?.user_metadata?.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;