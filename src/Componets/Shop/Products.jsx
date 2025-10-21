import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../Componets/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) setUserId(user.uid);
      else setUserId(null);
    });

    // Fetch products in real-time
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (pro) => {
      const productDatas = pro.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productDatas);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeAuth();
    };
  }, []);

  // Delete product
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product: ", error);
      toast.error("Failed to delete product");
    }
  };

  // Edit product
  const handleEdit = (id) => {
    navigate(`/editProduct/${id}`);
  };

  // Add to Cart
  const handleAddToCart = async (product, quantity) => {
    if (!userId) return toast.error("Please login first!");
    try {
      const cartRef = doc(db, "cart", `${userId}_${product.id}`);
      const cartSnap = await getDoc(cartRef);
      if (cartSnap.exists()) {
        // Update quantity if already in cart
        await updateDoc(cartRef, {
          quantity: cartSnap.data().quantity + quantity,
        });
      } else {
        await setDoc(cartRef, {
          userId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          quantity,
          createdAt: new Date(),
        });
      }
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  // Add/Remove Favorite
  const handleToggleFavorite = async (product) => {
    if (!userId) return toast.error("Please login first!");
    try {
      const favRef = doc(db, "favorites", `${userId}_${product.id}`);
      const favSnap = await getDoc(favRef);
      if (favSnap.exists()) {
        // remove favorite
        await deleteDoc(favRef);
        toast.success(`${product.name} removed from favorites`);
      } else {
        await setDoc(favRef, {
          userId,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          createdAt: new Date(),
        });
        toast.success(`${product.name} added to favorites`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update favorites");
    }
  };

  // Check if product is in favorites
  const isFavorite = async (productId) => {
    if (!userId) return false;
    const favRef = doc(db, "favorites", `${userId}_${productId}`);
    const favSnap = await getDoc(favRef);
    return favSnap.exists();
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
};

// Separate Product Card Component
const ProductCard = ({ product, onEdit, onDelete, onAddToCart, onToggleFavorite, userId }) => {
  const [quantity, setQuantity] = useState(1);
  const [fav, setFav] = useState(false);

  useEffect(() => {
    const checkFav = async () => {
      if (userId) {
        const favRef = doc(db, "favorites", `${userId}_${product.id}`);
        const favSnap = await getDoc(favRef);
        setFav(favSnap.exists());
      }
    };
    checkFav();
  }, [userId, product.id]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
      {/* Favorite Icon */}
      {userId && (
        <button
          onClick={() => {
            onToggleFavorite(product);
            setFav(!fav);
          }}
          className="absolute top-2 right-2 text-red-500"
        >
          {fav ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
        </button>
      )}

      <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h2>
        <p className="text-gray-600 text-sm mb-2">{product.discription}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-600 font-bold">${product.price}</span>
          {/* <span className="text-gray-500 text-sm">{product.productId}</span> */}
        </div>

        {/* Quantity Selector */}
        {userId && (
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              className="bg-gray-200 px-2 rounded"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-200 px-2 rounded"
            >
              +
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          {userId && (
            <button
              onClick={() => onAddToCart(product, quantity)}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
            >
              <FaShoppingCart /> Add to Cart
            </button>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default Products;
