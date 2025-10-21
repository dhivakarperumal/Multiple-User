import React, { useState, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { db } from "../../Componets/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

const Topbar = () => {
  const [stockAlerts, setStockAlerts] = useState([]);
  const [orderAlerts, setOrderAlerts] = useState([]);
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  // Fetch stock alerts (e.g., stock <= 5)
  useEffect(() => {
    const q = query(collection(db, "products")); // your products collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lowStock = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.stock <= 5);
      setStockAlerts(lowStock);
    });
    return () => unsubscribe();
  }, []);

  // Fetch new orders
  useEffect(() => {
    const q = query(collection(db, "orders"), where("status", "==", "new"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newOrders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrderAlerts(newOrders);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-full bg-white shadow-md flex flex-col md:flex-row justify-between items-center p-4 md:p-3 gap-3 md:gap-0">
      <h1 className="text-xl font-semibold text-gray-700">Welcome Admin</h1>

      <div className="flex items-center gap-4 relative">
        {/* Order Notifications */}
        <div className="relative">
          <FaBell
            className="text-gray-500 text-xl cursor-pointer"
            onClick={() => setShowOrderDropdown(!showOrderDropdown)}
          />
          {orderAlerts.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {orderAlerts.length}
            </span>
          )}

          {showOrderDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded border z-50">
              <h4 className="px-4 py-2 border-b font-semibold">New Orders</h4>
              {orderAlerts.length === 0 ? (
                <p className="p-4 text-gray-500">No new orders</p>
              ) : (
                orderAlerts.map((order) => (
                  <Link
                    key={order.id}
                    to={`/adminpanel/orders/${order.id}`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Order #{order.id} - {order.customerName || "Unknown"}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Stock Notifications */}
        <div className="relative">
          <span
            className="text-gray-500 text-xl cursor-pointer"
            onClick={() => setShowStockDropdown(!showStockDropdown)}
          >
            <FaBell />
          </span>
          {stockAlerts.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-yellow-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {stockAlerts.length}
            </span>
          )}

          {showStockDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded border z-50">
              <h4 className="px-4 py-2 border-b font-semibold">Low Stock</h4>
              {stockAlerts.length === 0 ? (
                <p className="p-4 text-gray-500">All products stocked</p>
              ) : (
                stockAlerts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/adminpanel/stockdetails`}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {product.name} - {product.stock} left
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Admin Profile */}
        <FaUserCircle className="text-gray-500 text-2xl cursor-pointer" />
      </div>
    </div>
  );
};

export default Topbar;
