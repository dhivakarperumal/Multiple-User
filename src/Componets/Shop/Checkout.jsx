// // Checkout.jsx
// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { db, auth } from "../firebase";
// import {
//   collection,
//   addDoc,
//   serverTimestamp,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   getDocs,
//   orderBy,
//   limit,
// } from "firebase/firestore";
// import toast from "react-hot-toast";

// const Checkout = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const cartItems = state?.cartItems || [];
//   const totalPrice = state?.totalPrice || 0;
//   const userId = auth.currentUser?.uid;

//   const [customer, setCustomer] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [loading, setLoading] = useState(false);
//   const [orderId, setOrderId] = useState("");

//   // Generate Order ID
//   useEffect(() => {
//     const generateOrderId = async () => {
//       const ordersRef = collection(db, "orders");
//       const q = query(ordersRef, orderBy("createdAt", "desc"), limit(1));
//       const lastOrderSnap = await getDocs(q);
//       let lastId = "ORD000";
//       lastOrderSnap.forEach((doc) => {
//         lastId = doc.data().orderId || "ORD000";
//       });
//       const numberPart = parseInt(lastId.replace("ORD", "")) + 1;
//       const newOrderId = `ORD${numberPart.toString().padStart(3, "0")}`;
//       setOrderId(newOrderId);
//     };
//     generateOrderId();
//   }, []);

//   const handleChange = (e) => {
//     setCustomer({ ...customer, [e.target.name]: e.target.value });
//   };


//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   const handlePlaceOrder = async () => {
//     if (!userId) {
//       toast.error("Please login first!");
//       navigate("/login");
//       return;
//     }

//     if (!customer.name || !customer.phone || !customer.address) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     setLoading(true);

//     try {
//       if (paymentMethod === "Online") {
//         // Razorpay Integration
//         const options = {
//           key: "rzp_test_2ORD27rb7vGhwj", 
//           amount: totalPrice * 100, // in paise
//           currency: "INR",
//           name: "My Shop",
//           description: `Order ${orderId}`,
//           handler: async function (response) {
//             // After successful payment
//             await saveOrder("Paid", response.razorpay_payment_id);
//           },
//           prefill: {
//             name: customer.name,
//             email: customer.email,
//             contact: customer.phone,
//           },
//           theme: {
//             color: "#3399cc",
//           },
//         };
//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } else {
//         // COD Payment
//         await saveOrder("Pending");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Payment failed");
//       setLoading(false);
//     }
//   };

//   const saveOrder = async (status, paymentId = null) => {
//     try {
//       // Save order to Firestore
//       const orderRef = collection(db, "orders");
//       await addDoc(orderRef, {
//         orderId,
//         userId,
//         customer,
//         cartItems,
//         totalPrice,
//         paymentMethod,
        
//         status: paymentMethod === "Online" ? status : "Pending",
//         paymentId: paymentId || null,
//         status:'Order Placed',
//         createdAt: serverTimestamp(),
//       });

//       // Clear cart in Firestore
//       const cartRef = collection(db, "cart");
//       const q = query(cartRef, where("userId", "==", userId));
//       const snapshot = await getDocs(q);
//       await Promise.all(snapshot.docs.map((docItem) => deleteDoc(doc(db, "cart", docItem.id))));

//       toast.success(`Order ${orderId} placed successfully!`);
//       navigate("/myorders", { state: { orderId } });
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to place order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cartItems.length === 0) {
//     return <p className="p-6">Your cart is empty.</p>;
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
//       <p className="mb-4 font-semibold">Order ID: {orderId}</p>

//       {/* Customer Details */}
//       <div className="bg-white p-6 rounded shadow mb-6">
//         <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Full Name"
//             value={customer.name}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={customer.email}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//           />
//           <input
//             type="text"
//             name="phone"
//             placeholder="Phone Number"
//             value={customer.phone}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             required
//           />
//           <input
//             type="text"
//             name="address"
//             placeholder="Shipping Address"
//             value={customer.address}
//             onChange={handleChange}
//             className="border p-2 rounded w-full"
//             required
//           />
//         </div>

//         {/* Payment Method */}
//         <div className="mt-4">
//           <label className="font-semibold mr-4">
//             <input
//               type="radio"
//               name="payment"
//               value="COD"
//               checked={paymentMethod === "COD"}
//               onChange={() => setPaymentMethod("COD")}
//               className="mr-2"
//             />
//             Cash on Delivery
//           </label>
//           <label className="font-semibold">
//             <input
//               type="radio"
//               name="payment"
//               value="Online"
//               checked={paymentMethod === "Online"}
//               onChange={() => setPaymentMethod("Online")}
//               className="mr-2"
//             />
//             Online Payment
//           </label>
//         </div>
//       </div>

//       {/* Order Summary */}
//       <div className="bg-white p-6 rounded shadow mb-6">
//         <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
//         <div className="space-y-4">
//           {cartItems.map((item) => (
//             <div key={item.id} className="flex justify-between items-center">
//               <div className="flex items-center gap-4">
//                 <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
//                 <div>
//                   <p className="font-semibold">{item.name}</p>
//                   <p className="text-gray-500 text-sm">
//                     {item.quantity} × ${item.price}
//                   </p>
//                 </div>
//               </div>
//               <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
//             </div>
//           ))}
//         </div>

//         <div className="flex justify-between mt-6 text-xl font-semibold">
//           <span>Total</span>
//           <span>${totalPrice.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* Place Order Button */}
//       <button
//         onClick={handlePlaceOrder}
//         disabled={loading}
//         className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
//       >
//         {loading ? "Processing..." : "Place Order"}
//       </button>
//     </div>
//   );
// };

// export default Checkout;


// Checkout.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import toast from "react-hot-toast";

// Optional: Shiprocket helper
import { getShiprocketToken, createShipment } from "../shiprocket";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const cartItems = state?.cartItems || [];
  const totalPrice = state?.totalPrice || 0;
  const userId = auth.currentUser?.uid;

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Generate Order ID
  useEffect(() => {
    const generateOrderId = async () => {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"), limit(1));
      const lastOrderSnap = await getDocs(q);
      let lastId = "ORD000";
      lastOrderSnap.forEach((doc) => {
        lastId = doc.data().orderId || "ORD000";
      });
      const numberPart = parseInt(lastId.replace("ORD", "")) + 1;
      setOrderId(`ORD${numberPart.toString().padStart(3, "0")}`);
    };
    generateOrderId();
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }

    if (!customer.name || !customer.phone || !customer.address) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "Online") {
        const options = {
          key: "rzp_test_2ORD27rb7vGhwj",
          amount: totalPrice * 100, // paise
          currency: "INR",
          name: "My Shop",
          description: `Order ${orderId}`,
          handler: async function (response) {
            await saveOrder("Paid", response.razorpay_payment_id);
          },
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phone,
          },
          theme: { color: "#3399cc" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        await saveOrder("Pending");
      }
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
      setLoading(false);
    }
  };

  const saveOrder = async (status, paymentId = null) => {
    try {
      // 1️⃣ Save order in Firestore
      const orderRef = collection(db, "orders");
      await addDoc(orderRef, {
        orderId,
        userId,
        customer,
        cartItems,
        totalPrice,
        paymentMethod,
        paymentId,
        status:'Order Placed',
        createdAt: serverTimestamp(),
      });

      
      const token = await getShiprocketToken();
      if(token) {
        await createShipment(token, { orderId, customer, cartItems });
      }

      // 3️⃣ Clear cart
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("userId", "==", userId));
      const snapshot = await getDocs(q);
      await Promise.all(snapshot.docs.map((docItem) => deleteDoc(doc(db, "cart", docItem.id))));

      toast.success(`Order ${orderId} placed successfully!`);
      navigate("/myorders", { state: { orderId } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <p className="p-6">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Checkout</h2>
      <p className="mb-4 font-semibold">Order ID: {orderId}</p>

      {/* Customer Details */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={customer.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={customer.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Shipping Address"
            value={customer.address}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        {/* Payment Method */}
        <div className="mt-4">
          <label className="font-semibold mr-4">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="mr-2"
            />
            Cash on Delivery
          </label>
          <label className="font-semibold">
            <input
              type="radio"
              name="payment"
              value="Online"
              checked={paymentMethod === "Online"}
              onChange={() => setPaymentMethod("Online")}
              className="mr-2"
            />
            Online Payment
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500 text-sm">
                    {item.quantity} × ${item.price}
                  </p>
                </div>
              </div>
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6 text-xl font-semibold">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </div>
  );
};

export default Checkout;
