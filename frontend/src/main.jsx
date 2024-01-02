import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

import ErrorPage from './pages/errors/ErrorPage.jsx';
import Home from './pages/home/Home.jsx';
import Navbar from './pages/components/Navbar.jsx';
import Register from './pages/auth/register/Register.jsx';
import Login from './pages/auth/login/Login.jsx';
import Auth from './pages/auth/Auth.jsx';
import Welcome from './pages/welcomePage/welcome.jsx';
import WelcomeIntro from './pages/welcomeIntro/WelcomeIntro.jsx';
import WelcomeDescri from './pages/welcomeDescri/WelcomeDescri.jsx';
import WelcomeService from './pages/welcomeService/WelcomeService.jsx';
import WelcomeTecno from './pages/welcomeTecno/WelcomeTecno.jsx';
import SplashScreen from './pages/components/SplashScreen.jsx';
import ProtectedRoute from './pages/auth/protectedRoute/ProtectedRoute.jsx';
import HomeSecurity from './pages/home/auth/HomeSecurity.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={App} />,
    // element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "Home",
        element: <Home />,
      },
      {
        path: "HomeSecurity",
        element: <HomeSecurity />
      },
      {
        path: "Navbar",
        element: <Navbar />,
      },
    ]
  },
  {
    path: "/Welcome",
    element: <Welcome />,
    children: [
      {
        path: "intro",
        element: <WelcomeIntro />
      },
      {
        path: "description",
        element: <WelcomeDescri />
      },
      {
        path: "service",
        element: <WelcomeService />
      },
      {
        path: "technologies",
        element: <WelcomeTecno />
      },
    ]
  },
  {
    path: "/auth",
    element: <Auth />,
    children:
      [
        {

          path: "/auth/register",
          element: <Register />
        },
        {
          path: "login",
          element: <Login />
        }
      ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SplashScreen />
    <RouterProvider router={router} />
  </React.StrictMode>,
)
