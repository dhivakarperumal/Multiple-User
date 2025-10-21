import React from "react";
import { Link } from "react-router-dom";
import Products from "./Shop/Products";
import Notifications from "./Notificationsend/Notifications";
import RegisterMobile from "./Notificationsend/Notifications";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to MyBrand
          </h1>
          <p className="text-gray-300 mb-8">
            Discover the best products and services tailored for you.
          </p>
          <Link
            to="/shop"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg font-semibold"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-100 flex-1">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <Products/>
        </div>
      </section>

      <section>
        <Notifications/>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
        <p className="mb-6">Get updates about our latest products and offers.</p>
        <form className="flex justify-center max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 rounded-l w-full focus:outline-none text-gray-800"
          />
          <button className="bg-white text-blue-600 px-6 rounded-r font-semibold hover:bg-gray-200">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
};

export default Home;
