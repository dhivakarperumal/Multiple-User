// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBN8vlzelW0kqY4NIOyu6qnzHjwWJpXlyI",
//   authDomain: "hello-27bad.firebaseapp.com",
//   projectId: "hello-27bad",
//   storageBucket: "hello-27bad.appspot.com", 
//   messagingSenderId: "100082330049",
//   appId: "1:100082330049:web:7d05ee6547b833d745a740"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Auth & Firestore
// const auth = getAuth(app);
// const db = getFirestore(app);
// const messaging = getMessaging(app);

// export { messaging, getToken, onMessage };

// export { auth, db };


// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBN8vlzelW0kqY4NIOyu6qnzHjwWJpXlyI",
  authDomain: "hello-27bad.firebaseapp.com",
  projectId: "hello-27bad",
  storageBucket: "hello-27bad.appspot.com",
  messagingSenderId: "100082330049",
  appId: "1:100082330049:web:7d05ee6547b833d745a740"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

// Handle browsers that don't support FCM
let messaging = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn("This browser does not support Firebase Messaging.");
    }
  });
}

const functions = getFunctions(app);

export { app, auth, db, messaging,functions };
