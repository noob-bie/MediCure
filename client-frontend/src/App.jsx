import React, { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/profile/Profile";
import AdminPanel from "./pages/adminPanel/AdminPanel";
import Login from "./pages/login/Login";
import { element } from "prop-types";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const Layout = () => {
    return (
      <div>
        {/* Passing state to Navbar */}
        <Navbar />
        <Outlet />
       
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/shop", element: <Shop /> },
        { path: "/cart", element: <Cart /> },
        { path: "/profile", element: <Profile /> },
        { path: "/login", element: <Login/>},
        isAdmin && { path: "/admin", element: <AdminPanel /> },
      ].filter(Boolean),
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
