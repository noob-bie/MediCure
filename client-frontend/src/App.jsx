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
import SingleProduct from "./pages/singleProduct/SingleProduct";
import Checkout from "./pages/checkout/Checkout";
import Payment from "./pages/payment/Payment";
import Orders from "./pages/orders/Orders";
import ProductManagement from "./pages/adminPanel/productManagement/ProductManagement";
import OrderManagement from "./pages/adminPanel/oderManagement/OrderManagement";
import DeliveryManagement from "./pages/adminPanel/deliveryManagement/DeliveryManagement";
import AddProduct from "./pages/adminPanel/productManagement/addProduct/AddProduct";
import UpdateProduct from "./pages/adminPanel/productManagement/updateProduct/UpdateProduct";
import DeleteProduct from "./pages/adminPanel/productManagement/deleteProduct/DeleteProduct";
import SingleProductUpdate from "./pages/adminPanel/productManagement/updateProduct/singleProductUpdate/SingleProductUpdate";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const [cartItems, setCartItems] = useState([]);

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
          element: <Shop />,
          children: [
            { path: "healthcare", element: <Healthcare /> },
            { path: "homecare", element: <Homecare /> },
            { path: "medicines", element: <Medicines /> },
            { path: "baby&momcare", element: <BabyAndMomcare /> },
          ],
        },
        {
          path: "/cart",
          element: <Cart cartItems={cartItems} setCartItems={setCartItems} />, // Pass props here
        },
        { path: "/checkout", element: <Checkout /> },
        { path: "/payment", element: <Payment /> },
        { path: "/profile", element: <Profile /> },
        { path: "/orders", element: <Orders /> },
        { path: "/login", element: <Login /> },
        { path: "/signup", element: <Signup /> },
        { path: "/product/:id", element: <SingleProduct /> }, // Corrected route
        // { path: "/products/:id", element: <SingleProduct /> },
        // { path: "/products/baby&momcare/:productName", element: <SingleProduct /> },
        // { path: "/products/healthcare/:productName", element: <SingleProduct /> },
        // { path: "/products/homecare/:productName", element: <SingleProduct /> },
        // { path: "/products/medicines/:productName", element: <SingleProduct /> },
        isAdmin
          ? {
              path: "/admin",
              element: <AdminPanel />,
              children: [
                {
                  path: "product-management",
                  element: <ProductManagement />,
                  children: [
                    { path: "Add Product", element: <AddProduct /> },
                    { path: "Update Products", element: <UpdateProduct /> },
                    { path: "Delete Products", element: <DeleteProduct /> },
                    { path: "UpdateSingleProduct/:id", element: <SingleProductUpdate /> }, 
                  ],
                },
                {
                  path: "order-management",
                  element: <OrderManagement />,
                },
                {
                  path: "delivery-management",
                  element: <DeliveryManagement />,
                },
              ],
            }
          : null,
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
