import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChevronDown,
  FaChevronUp,
  FaBars,
  FaBoxes
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  // State
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile toggle

  // Menu items
  const menuItems = [{ name: "Dashboard", path: "/adminpanel/dashboard", icon: <FaTachometerAlt /> }];

  const ordersItems = [
    { name: "New Orders", path: "/adminpanel/neworders" },
    { name: "All Orders", path: "/adminpanel/all" },
    { name: "Delivered Orders", path: "/adminpanel/delivered" },
    { name: "Cancelled Orders", path: "/adminpanel/cancelled" },
    { name: "Return Orders", path: "/adminpanel/returned" },
    
  ];

  const productsItems = [
    { name: "Add Product", path: "/adminpanel/addproducts" },
    { name: "All Products", path: "/adminpanel/shop" },
    { name: "Add Category", path: "/adminpanel/addcategory" },
  ];

  const stockItems = [
    { name: "Stock Details", path: "/adminpanel/stockdetails" },
    { name: "Add Stock", path: "/adminpanel/addstock" },
  ];

  const usersItems = [
    { name: "All Users", path: "/adminpanel/users" },
    { name: "Add User", path: "/adminpanel/adduser" },
  ];

  const renderDropdown = (isOpen, setOpen, title, icon, items) => (
    <div>
      <button
        onClick={() => setOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 rounded-lg transition ${
          items.some((i) => location.pathname === i.path) ? "bg-green-600" : "hover:bg-green-700"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          {title}
        </div>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      {isOpen && (
        <div className="flex flex-col pl-10 mt-1 gap-1">
          {items.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`px-4 py-2 rounded-lg transition ${
                location.pathname === item.path ? "bg-green-600" : "hover:bg-green-700"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-green-800 text-white p-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars className="text-2xl" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-green-800 text-white w-64 p-4 overflow-y-auto transform transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:top-0`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                location.pathname === item.path ? "bg-green-600" : "hover:bg-green-700"
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          {renderDropdown(ordersOpen, setOrdersOpen, "Orders", <FaShoppingCart />, ordersItems)}
          {renderDropdown(productsOpen, setProductsOpen, "Products", <FaBox />, productsItems)}
          {renderDropdown(stockOpen, setStockOpen, "Stock", <FaBoxes />, stockItems)}
          {renderDropdown(true, () => {}, "Users", <FaUsers />, usersItems)}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
