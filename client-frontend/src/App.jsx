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
import Signup from "./pages/signup/Signup";
import { element } from "prop-types";
import Healthcare from "./pages/shop/healthcare/Healthcare";
import Homecare from "./pages/shop/homecare/Homecare";
import Medicines from "./pages/shop/medicine/Medicines";
import BabyAndMomcare from "./pages/shop/babyandmomcare/BabyAndMomcare";
import SingleProduct from  "./pages/singleProduct/SingleProduct";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAdmin = localStorage.getItem("userRole") === "admin"; // Fetch admin role from storage


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
        {
          path: "/shop",
          element: <Shop />, // Shop is now a parent route
          children: [
            { path: "healthcare", element: <Healthcare /> },
            { path: "homecare", element: <Homecare /> },
            { path: "medicines", element: <Medicines /> },
            { path: "baby&momcare", element: <BabyAndMomcare /> },
            
          ],
        },

        { path: "/cart", element: <Cart /> },
        { path: "/profile", element: <Profile /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
        { path: "/shop/:productName", element: <SingleProduct /> },
        { path: "/shop/baby&momcare/:productName", element: <SingleProduct /> },
        { path: "/shop/healthcare/:productName", element: <SingleProduct /> },
        { path: "/shop/homecare/:productName", element: <SingleProduct /> },
        { path: "/shop/medicines/:productName", element: <SingleProduct /> },

        isAdmin?  { path: "/admin", element: <AdminPanel /> }: null,
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
