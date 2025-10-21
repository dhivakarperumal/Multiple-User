import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const Fav = () => {
  const [favItems, setFavItems] = useState([]);
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

  // Fetch favorite items
  useEffect(() => {
    if (!userId) return;

    const favRef = collection(db, "favorites"); 
    const q = query(favRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavItems(items);
    });

    return () => unsubscribe();
  }, [userId]);

  // Remove from favorites
  const handleRemove = async (itemId) => {
    try {
      await deleteDoc(doc(db, "favorites", itemId));
      toast.success("Item removed from favorites");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  // Navigate to product page
  const handleView = (item) => {
    navigate(`/product/${item.productId}`); // assumes you have a product detail page
  };

  if (!userId) return <p className="p-6">Please login to view your favorites.</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Your Favorites</h2>

      {favItems.length === 0 ? (
        <p>Your favorites list is empty.</p>
      ) : (
        <div className="space-y-4">
          {favItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white p-4 rounded shadow"
            >
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => handleView(item)}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">${item.price}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Fav;
