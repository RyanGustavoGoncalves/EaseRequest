// No arquivo ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  // const token = localStorage.getItem('token');
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IndlbGNvbWUiLCJpYXQiOjE1MTYyMzkwMjJ9.PxmS8bO1WyK99LDVfUfTEuWPH4WcG-I_JP68pB70vMo";
  const isAuthenticated = token !== null && token !== undefined && token !== "";

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/Welcome" />;
};

export default ProtectedRoute;