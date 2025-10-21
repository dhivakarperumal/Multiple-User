import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

const Navbars = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [favCount, setFavCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let cartUnsub = null;
    let favUnsub = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user info
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUserData(userSnap.data());

        // Live cart updates
        const cartRef = collection(db, "cart");
        const cartQuery = query(cartRef, where("userId", "==", currentUser.uid));
        cartUnsub = onSnapshot(cartQuery, (snapshot) => {
          setCartCount(snapshot.docs.length);
        });

        // Live favorites updates
        const favRef = collection(db, "favorites");
        const favQuery = query(favRef, where("userId", "==", currentUser.uid));
        favUnsub = onSnapshot(favQuery, (snapshot) => {
          setFavCount(snapshot.docs.length);
        });
      } else {
        setUserData(null);
        setCartCount(0);
        setFavCount(0);
        if (cartUnsub) cartUnsub();
        if (favUnsub) favUnsub();
      }
    });

    return () => {
      unsubscribe();
      if (cartUnsub) cartUnsub();
      if (favUnsub) favUnsub();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const goToProfile = () => {
    if (userData?.role === "admin") navigate("/adminpanel");
    else navigate("/myorders");
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold">MyBrand</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded">Home</Link>
            <Link to="/shop" className="hover:bg-gray-700 px-3 py-2 rounded">Shop</Link>
            <Link to="/services" className="hover:bg-gray-700 px-3 py-2 rounded">Services</Link>
            <Link to="/contact" className="hover:bg-gray-700 px-3 py-2 rounded">Contact</Link>

            {/* Cart Icon */}
            {user && (
              <Link to="/cart" className="relative px-3 py-2 hover:bg-gray-700 rounded">
                <FaShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-1 bg-red-500 text-xs rounded-full px-1">{cartCount}</span>
                )}
              </Link>
            )}

            {/* Favorites Icon */}
            {user && (
              <Link to="/favorites" className="relative px-3 py-2 hover:bg-gray-700 rounded">
                <FaHeart size={18} />
                {favCount > 0 && (
                  <span className="absolute top-0 right-1 bg-red-500 text-xs rounded-full px-1">{favCount}</span>
                )}
              </Link>
            )}

            {/* User Dropdown */}
            {user && userData ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white"
                  title={userData.name}
                >
                  {userData.name.charAt(0).toUpperCase()}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-50">
                    <button onClick={goToProfile} className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                      {userData.role === "admin" ? "Admin Panel" : "My Account"}
                    </button>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded font-semibold">Register</Link>
                <Link to="/login" className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded font-semibold">Login</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none text-2xl">
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-2 pt-2 pb-3 space-y-1">
          <Link to="/" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/shop" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/services" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/contact" className="block px-3 py-2 rounded hover:bg-gray-700" onClick={() => setIsOpen(false)}>Contact</Link>

          {user && userData ? (
            <>
              <Link to="/cart" className="block px-3 py-2 mt-2 rounded bg-gray-700 font-semibold">Cart ({cartCount})</Link>
              <Link to="/favorites" className="block px-3 py-2 mt-2 rounded bg-gray-700 font-semibold">Favorites ({favCount})</Link>
              <button onClick={goToProfile} className="block px-3 py-2 mt-2 rounded bg-gray-700 w-full font-semibold">
                {userData.role === "admin" ? "Admin Panel" : "My Account"}
              </button>
              <button onClick={handleLogout} className="block px-3 py-2 mt-2 rounded bg-red-600 hover:bg-red-700 w-full font-semibold">Logout</button>
            </>
          ) : (
            <>
              <Link to="/register" className="block px-3 py-2 mt-2 rounded bg-blue-600 hover:bg-blue-700 text-center font-semibold" onClick={() => setIsOpen(false)}>Register</Link>
              <Link to="/login" className="block px-3 py-2 mt-2 rounded bg-green-600 hover:bg-green-700 text-center font-semibold" onClick={() => setIsOpen(false)}>Login</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbars;
