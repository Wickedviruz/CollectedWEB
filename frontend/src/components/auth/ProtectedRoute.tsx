import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Omdirigera till inloggningssidan om användaren inte har någon token
      navigate('/login');
    }
  }, [navigate]);

  return children;
};

export default ProtectedRoute;
