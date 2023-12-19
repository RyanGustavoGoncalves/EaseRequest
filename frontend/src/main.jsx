import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { createBrowserRouter, RouterProvider  } from 'react-router-dom';

import ErrorPage from './pages/errors/ErrorPage.jsx';
import Home from './pages/home/Home.jsx';
import Navbar from './pages/components/Navbar.jsx';
import Register from './pages/auth/register/Register.jsx';
import Welcome from './pages/welcomePage/welcome.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
      path: "/",
      element: <Home />,
      },
      {
        path:"/",
        element: <Navbar/>,
      },
    ]
  },
  {
    path:"welcome",
    element: <Welcome />
  },
  {
    path:"auth/register",
    element: <Register />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
