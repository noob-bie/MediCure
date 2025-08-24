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

// Product management specific routes
import AddProduct from "./pages/adminPanel/productManagement/addProduct/AddProduct";
import UpdateProduct from "./pages/adminPanel/productManagement/updateProduct/UpdateProduct";
import DeleteProduct from "./pages/adminPanel/productManagement/deleteProduct/DeleteProduct";
import SingleProductUpdate from "./pages/adminPanel/productManagement/updateProduct/singleProductUpdate/SingleProductUpdate";

// Rider Panel routes
import RiderPanel from "./pages/riderPanel/RiderPanel";
import MyOrders from "./pages/riderPanel/myOrders/MyOrders";
import DeliveryHistory from "./pages/riderPanel/deliveryHistory/DeliveryHistory";
import PaymentDetails from "./pages/riderPanel/paymentDetails/PaymentDetails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAdmin = localStorage.getItem("userRole") === "admin";
  const isDeliveryMan = localStorage.getItem("userRole") === "delivery man";
  const [cartItems, setCartItems] = useState([]);

  const Layout = () => (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );

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
        { path: "/cart", element: <Cart cartItems={cartItems} setCartItems={setCartItems} /> },
        { path: "/checkout", element: <Checkout /> },
        { path: "/payment", element: <Payment /> },
        { path: "/profile", element: <Profile /> },
        { path: "/orders", element: <Orders /> },
        { path: "/login", element: <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} /> },
        { path: "/signup", element: <Signup /> },
        { path: "/product/:id", element: <SingleProduct /> },

        // Admin routes
        ...(isAdmin
          ? [
              {
                path: "/admin",
                element: <AdminPanel />,
                children: [
                  {
                    path: "product-management",
                    element: <ProductManagement />,
                    children: [
                      { path: "add-product", element: <AddProduct /> },
                      { path: "update-products", element: <UpdateProduct /> },
                      { path: "delete-products", element: <DeleteProduct /> },
                      { path: "update-single-product/:id", element: <SingleProductUpdate /> },
                    ],
                  },
                  { path: "order-management", element: <OrderManagement /> },
                  { path: "delivery-management", element: <DeliveryManagement /> },
                ],
              },
            ]
          : []),

        // Delivery man routes
        ...(isDeliveryMan
          ? [
              {
                path: "/delivery",
                element: <RiderPanel />,
                children: [
                  { path: "my-orders", element: <MyOrders /> },
                  { path: "delivery-history", element: <DeliveryHistory /> },
                  { path: "payment-details", element: <PaymentDetails /> },
                ],
              },
            ]
          : []),
      ],
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;