import React, { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/home/Home";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";
import Profile from "./pages/profile/Profile";
import AdminPanel from "./pages/adminPanel/AdminPanel";
import LoginSignup from "./pages/loginSignup/LoginSignup";
import { element } from "prop-types";
import Healthcare from "./pages/healthcare/Healthcare";
import Homecare from "./pages/homecare/Homecare";
import Medicines from "./pages/medicine/Medicines";
import BabyAndMomcare from "./pages/babyandmomcare/BabyAndMomcare";

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
        { path: "/healthcare", element: <Healthcare /> },
        {path :"/homecare",element:<Homecare/>},
        {path:"/medicines",element:<Medicines/>},
        {path:"/baby&momcare",element:<BabyAndMomcare/>},
        { path: "/cart", element: <Cart /> },
        { path: "/profile", element: <Profile /> },
        { path: "/loginSignup", element: <LoginSignup /> },
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
