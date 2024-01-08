import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Element, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const token = localStorage.getItem('token');
  console.log(token)
  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IndlbGNvbWUiLCJpYXQiOjE1MTYyMzkwMjJ9.PxmS8bO1WyK99LDVfUfTEuWPH4WcG-I_JP68pB70vMo";

  useEffect(() => {
    const checkToken = async () => {

      if (token) {
        try {
          const response = await fetch('http://localhost:8080/token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const responseBody = await response.json();
            const role = responseBody.role;
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            alert("Token Inválido ou expirado!")
          }
        } catch (error) {
          alert("Erro ao buscar token!", error)
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Element {...rest} /> : <Navigate to="/Welcome" />;
};

export default ProtectedRoute;
