import React, { useEffect, useState } from "react";
import { db } from "../../Componets/firebase";
import {
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  setDoc
} from "firebase/firestore";
import imageCompression from "browser-image-compression";
import { Link, useParams, useNavigate } from "react-router-dom";

const AddProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [discription, setDiscription] = useState("");
  const [color, setColor] = useState("");
  const [images, setImages] = useState([]); 
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const docRef = doc(db, "products", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.name || "");
          setPrice(data.price || 0);
          setDiscription(data.discription || "");
          setColor(data.color || "");
          setImages(data.images || []); 
        }
      };
      fetchProduct();
    }
  }, [id]);


  const generateProductId = async () => {
    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      const lastId = snap.docs[0].data().productId || "PD000";
      const num = parseInt(lastId.replace("PD", "")) + 1;
      return "PD" + num.toString().padStart(3, "0");
    } else {
      return "PD001";
    }
  };



const handleSaveProduct = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    if (id) {
      
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        name,
        price: Number(price),
        discription,
        color,
        images,
      });
      alert("Product updated successfully!");
    } else {
      const productId= await generateProductId()
      const docRef = doc(collection(db, "products")); 
      const docId = docRef.id;

      await setDoc(docRef, {
        productId,
        id: docId,          
        name,
        price: Number(price),
        discription,
        color,
        images,
        createdAt: serverTimestamp(),
      });

      alert("Product added successfully!");
      setName("");
      setDiscription("");
      setPrice(0);
      setColor("");
      setImages([]);
    }

    navigate("/");
  } catch (err) {
    console.error("Error saving product:", err);
  } finally {
    setLoading(false);
  }
};


  // 🔹 Multiple Image Upload with compression
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedImages = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, options);
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(compressedFile);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
          });
        })
      );

      setImages((prev) => [...prev, ...compressedImages]);
    } catch (error) {
      console.error("Image compression error:", error);
    }
  };

 
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      

      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {id ? "✏️ Update Product" : "➕ Add New Product"}
          </h2>

          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
                placeholder="Enter product name"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Description
              </label>
              <textarea
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
                placeholder="Enter description"
                rows="3"
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300 outline-none"
                placeholder="Enter product color"
                required
              />
            </div>

            
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              />
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              {loading ? "Saving..." : id ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
