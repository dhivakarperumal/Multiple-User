import { getDoc ,doc} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {db} from './firebase';


const ProductDetails = () => {
    const {id} =useParams()
    const [product,setProducts]=useState(null)

    useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          setProducts(snap.data());
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

 if (!product) return <div>Loading...</div>;

  return (
    <div>
      <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700">{product.discription}</p>
      <p className="font-semibold">Price: ₹{product.price}</p>
      {product.img && <img src={product.img} alt={product.name} className="mt-4 w-64 h-64 object-cover"/>}
    </div>

    </div>
  )
}

export default ProductDetails
