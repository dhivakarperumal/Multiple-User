import React, { useState } from "react";
import { auth, db } from "../Componets/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc,serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Handle normal email login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user role from Firestore
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "admin") {
          navigate("/adminpanel"); 
        } else {
          navigate("/"); 
        }
      } else {
       
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  };

  // Handle Google login
 const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user) throw new Error("No user data returned from Google");

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    // Create user if doesn't exist
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        name: user.displayName || "Unnamed User",
        email: user.email || "",
        role: "user",
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    }

    // Fetch latest user data
    const finalSnap = await getDoc(userRef);
    const userData = finalSnap.data();

    if (userData?.role === "admin") {
      navigate("/adminpanel");
    } else {
      navigate("/");
    }
  } catch (err) {
    console.error("Google login error:", err);
    setError?.(err.message || "Failed to login with Google");
  }
};

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500">{error}</p>}

        {/* Email Login */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 w-full rounded"
        >
          Login
        </button>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-2 bg-blue-500 text-white p-2 w-full rounded"
        >
          Login with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
