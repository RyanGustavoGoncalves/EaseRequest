// AuthGuard.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './seu-contexto-de-autenticacao'; // Importe o contexto de autenticação

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext); // Substitua por sua lógica real de autenticação

  // Verifique se o usuário está autenticado
  if (!isLoggedIn) {
    // Redirecione para a página de login se não estiver autenticado
    navigate('/auth/login');
    return null;
  }

  // Se o usuário estiver autenticado, renderize as rotas protegidas
  return <>{children}</>;
};

export default AuthGuard;
