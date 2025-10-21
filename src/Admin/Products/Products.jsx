// import React, { useState, useEffect } from "react";
// import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
// import { db } from "../Componets/firebase";
// import { useNavigate } from "react-router-dom";

// const Products = () => {
//   const [product, setProducts] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     try {
//       const unsubscribe = onSnapshot(collection(db, "products"), (pro) => {
//         const productDatas = pro.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setProducts(productDatas);
//       });

//       return () => unsubscribe(); 
//     } catch (error) {
//       console.log(error);
//     }
//   }, []);

 
//   const handleDelete = async (id) => {
//     try {
//       await deleteDoc(doc(db, "products", id));
//       console.log("Product deleted successfully!");
//     } catch (error) {
//       console.error("Error deleting product: ", error);
//     }
//   };

//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
//         {product.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
//           >
//             <img
//               src={item.img}
//               alt={item.name}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <h2
//                 className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer"
//                 onClick={() => navigate(`/productDetails/${item.id}`)}
//               >
//                 {item.name}
//               </h2>
//               <p className="text-gray-600 text-sm mb-2">{item.discription}</p>
//               <div className="flex justify-between items-center">
//                 <span className="text-green-600 font-bold">${item.price}</span>
//                 <span className="text-gray-500 text-sm">{item.productId}</span>
//               </div>

//               {/* Delete button */}
//               <button
//                 onClick={() => handleDelete(item.id)}
//                 className="mt-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default Products;


import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../Componets/firebase";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [product, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(collection(db, "products"), (pro) => {
        const productDatas = pro.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productDatas);
      });

      return () => unsubscribe();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      console.log("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/editProduct/${id}`); 
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {product.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={item.images[0]}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2
                className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer"
                onClick={() => navigate(`/productDetails/${item.id}`)}
              >
                {item.name}
              </h2>
              <p className="text-gray-600 text-sm mb-2">{item.discription}</p>
              <div className="flex justify-between items-center">
                <span className="text-green-600 font-bold">${item.price}</span>
                <span className="text-gray-500 text-sm">{item.productId}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
