// No arquivo ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const token = localStorage.getItem('token');
  // const token = null;
  const isAuthenticated = token !== null && token !== undefined && token !== "";

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/Welcome" />;
};

export default ProtectedRoute;