import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Listen for user auth
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch cart items
  useEffect(() => {
    if (!userId) return;

    const cartRef = collection(db, "cart");
    const q = query(cartRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
    });

    return () => unsubscribe();
  }, [userId]);

  // Update quantity
  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;
    try {
      const cartDocRef = doc(db, "cart", item.id);
      await updateDoc(cartDocRef, { quantity: newQty });
    } catch (error) {
      console.error(error);
      toast.error("Failed to update quantity");
    }
  };

  // Remove from cart
  const handleRemove = async (itemId) => {
    try {
      await deleteDoc(doc(db, "cart", itemId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  // Calculate total
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Checkout
  const handleCheckout = () => {
    if (!userId) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    navigate("/checkout", { state: { cartItems, totalPrice } });
  };

  if (!userId) return <p className="p-6">Please login to view your cart.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">${item.price} per unit</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity - 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          {/* Total & Checkout */}
          <div className="flex justify-between items-center mt-6 bg-gray-100 p-4 rounded">
            <span className="text-xl font-semibold">
              Total: ${totalPrice.toFixed(2)}
            </span>
            <button
              onClick={handleCheckout}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
