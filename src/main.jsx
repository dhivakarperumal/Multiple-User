import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import { Toaster } from "react-hot-toast";


// Admin imports
import AdminLayout from "./Admin/Addminpanel.jsx";
import Dashboard from "./Admin/Dashboard.jsx";
import AddProducts from "./Admin/Products/AddProducts.jsx";

// Auth imports
import Login from "./Componets/Login.jsx";
import Registers from "./Componets/Register.jsx";
import Home from "./Componets/Home.jsx";
import Shop from "./Admin/Products/Products.jsx";
import AllUsers from "./Admin/Users/Allusers.jsx";
import Fav from "./Componets/Shop/Fav.jsx";
import Cart from "./Componets/Shop/Cart.jsx";
import Checkout from "./Componets/Shop/Checkout.jsx";
import MyOrders from "./Componets/Shop/Myorders.jsx";
import AllOrders from "./Admin/Orders/Allorders.jsx";
import NewOrders from "./Admin/Orders/Neworders.jsx";
import DeliveredOrders from "./Admin/Orders/Delivered.jsx";
import CancelledOrders from "./Admin/Orders/Cancelled.jsx";
import ReturnedOrders from "./Admin/Orders/Returenorders.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children:[
      { path: "/", element: <Home /> },
      { path: "/favorites", element: <Fav /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/myorders", element: <MyOrders /> },
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Registers /> },
  {
    path: "/adminpanel",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "addproducts", element: <AddProducts /> },
      { path: "addproducts", element: <AddProducts /> },
      { path: "shop", element: <Shop /> },
      { path: "users", element: <AllUsers /> },

      { path: "neworders", element: <NewOrders /> },
      { path: "all", element: <AllOrders /> },
      { path: "delivered", element: <DeliveredOrders /> },
      { path: "cancelled", element: <CancelledOrders /> },
      { path: "returned", element: <ReturnedOrders /> },
      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
   
      <RouterProvider router={router} />
      {/* <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
            fontSize: "14px",
          },
          duration: 2000,
        }} 
      />*/}
    
  </React.StrictMode>
);
