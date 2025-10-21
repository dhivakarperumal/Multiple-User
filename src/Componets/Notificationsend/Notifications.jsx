// import React, { useEffect, useState } from "react";
// import { messaging, db } from "../firebase";
// import { getToken, onMessage, isSupported, getMessaging } from "firebase/messaging";
// import { doc, setDoc } from "firebase/firestore";

// const Notifications = () => {
//   const [mobile, setMobile] = useState("");
//   const [notification, setNotification] = useState(null);
//   const [fcmToken, setFcmToken] = useState(null);
//   const [status, setStatus] = useState("Initializing...");

//   useEffect(() => {
//     const initFCM = async () => {
//       try {
//         // Check if FCM is supported
//         const supported = await isSupported();
//         if (!supported) {
//           setStatus("Firebase Cloud Messaging not supported in this browser.");
//           console.warn("FCM not supported");
//           return;
//         }

//         // Register service worker
//         const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
//           scope: "/",
//         });
//         console.log("✅ Service Worker registered:", registration);

//         // Wait until the service worker is ready
//         await navigator.serviceWorker.ready;

//         // Request permission for notifications
//         const permission = await Notification.requestPermission();
//         if (permission !== "granted") {
//           setStatus("Notification permission denied by user.");
//           console.warn("Permission denied");
//           return;
//         }

//         // Get FCM instance
//         const messagingInstance = getMessaging();

//         // Get FCM token
//         const token = await getToken(messagingInstance, {
//           vapidKey:
//             "BO8udPVCER5sfE-uwqzjHRuyH-qQZc8Kf9JQQKuX7GGTPRRA34UbJPpbZhX0TMxqh4_MAVnFM7eWC5gSTdtTPhs",
//           serviceWorkerRegistration: registration,
//         });

//         if (token) {
//           console.log("🔥 FCM Token:", token);
//           setFcmToken(token);
//           setStatus("FCM Initialized Successfully!");
//         } else {
//           console.warn("No registration token available.");
//           setStatus("Failed to get FCM token.");
//         }

//         // Foreground message handler
//         const unsubscribe = onMessage(messagingInstance, (payload) => {
//           console.log("📩 Foreground message:", payload);
//           setNotification(payload.notification);
//         });

//         return () => unsubscribe();
//       } catch (error) {
//         console.error("❌ Error initializing FCM:", error);
//         setStatus("Error initializing FCM. Check console for details.");
//       }
//     };

//     if ("serviceWorker" in navigator && window.Notification) {
//       initFCM();
//     } else {
//       setStatus("Browser does not support service workers or notifications.");
//       console.warn("SW/Notification not supported");
//     }
//   }, []);

//   const handleRegisterMobile = async (e) => {
//     e.preventDefault();
//     if (!mobile.trim()) return alert("Enter a valid mobile number");

//     if (!fcmToken) {
//       alert("FCM not initialized yet — please wait a moment.");
//       return;
//     }

//     try {
//       await setDoc(doc(db, "users", mobile), { mobile, token: fcmToken });
//       alert("✅ Mobile number registered for notifications!");
//     } catch (error) {
//       console.error("Error saving mobile number:", error);
//       alert("Error saving mobile number. Check console.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-semibold mb-3">Firebase Notifications</h2>

//       <p className="text-sm mb-4 text-gray-600">Status: {status}</p>

//       {/* Mobile registration form */}
//       <form onSubmit={handleRegisterMobile} className="mb-4">
//         <input
//           type="text"
//           placeholder="Enter mobile number"
//           value={mobile}
//           onChange={(e) => setMobile(e.target.value)}
//           className="border p-2 rounded mr-2"
//         />
//         <button type="submit" className="bg-blue-600 text-white p-2 rounded">
//           Register
//         </button>
//       </form>

//       {/* Display FCM Token */}
//       {fcmToken && (
//         <div className="mb-3 break-all text-xs bg-gray-100 p-2 rounded">
//           <strong>FCM Token:</strong> {fcmToken}
//         </div>
//       )}

//       {/* Show last notification */}
//       {notification ? (
//         <div className="border p-3 rounded bg-gray-100">
//           <h3 className="font-bold">{notification.title}</h3>
//           <p>{notification.body}</p>
//         </div>
//       ) : (
//         <p>No notifications received yet...</p>
//       )}
//     </div>
//   );
// };

// export default Notifications;


import React, { useEffect, useState } from "react";
import { messaging, db, functions } from "../firebase"; // import functions
import { getToken, onMessage, isSupported, getMessaging } from "firebase/messaging";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

const Notifications = () => {
  const [mobile, setMobile] = useState("");
  const [messageText, setMessageText] = useState("");
  const [notification, setNotification] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const initFCM = async () => {
      try {
        const supported = await isSupported();
        if (!supported) {
          setStatus("Firebase Cloud Messaging not supported in this browser.");
          return;
        }

        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        await navigator.serviceWorker.ready;
        console.log("✅ Service Worker registered");

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setStatus("Permission denied by user.");
          return;
        }

        const messagingInstance = getMessaging();
        const token = await getToken(messagingInstance, {
          vapidKey: "BO8udPVCER5sfE-uwqzjHRuyH-qQZc8Kf9JQQKuX7GGTPRRA34UbJPpbZhX0TMxqh4_MAVnFM7eWC5gSTdtTPhs",
          serviceWorkerRegistration: registration,
        });

        if (token) {
          console.log("🔥 FCM Token:", token);
          setFcmToken(token);
          setStatus("FCM ready!");
        } else {
          setStatus("Failed to get FCM token.");
        }

        const unsubscribe = onMessage(messagingInstance, (payload) => {
          console.log("📩 Foreground message:", payload);
          setNotification(payload.notification);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("❌ FCM init error:", error);
        setStatus("Error initializing FCM");
      }
    };

    if ("serviceWorker" in navigator) {
      initFCM();
    }
  }, []);

  const handleRegisterMobile = async (e) => {
    e.preventDefault();
    if (!mobile.trim()) return alert("Enter a valid mobile number");

    if (!fcmToken) {
      alert("FCM not initialized yet. Please wait...");
      return;
    }

    try {
      await setDoc(doc(db, "users", mobile), { mobile, token: fcmToken });
      alert("✅ Mobile registered for notifications!");
    } catch (err) {
      console.error("Error saving mobile:", err);
      alert("Error saving mobile.");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!mobile.trim() || !messageText.trim()) {
      alert("Enter mobile number and message text.");
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", mobile));
      if (!userDoc.exists()) {
        alert("❌ Mobile number not registered for notifications.");
        return;
      }

      const { token } = userDoc.data();
      if (!token) {
        alert("User has no FCM token stored.");
        return;
      }

      const sendNotification = httpsCallable(functions, "sendNotification");
      const result = await sendNotification({ token, title: "Message from Admin", body: messageText });

      if (result.data.success) {
        alert("✅ Message sent successfully!");
        setMessageText("");
      } else {
        alert("❌ Message failed. Check Firebase logs.");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error sending message. See console.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Firebase Notifications</h2>
      <p className="text-sm mb-4 text-gray-600">Status: {status}</p>

      <form onSubmit={handleRegisterMobile} className="mb-4">
        <input
          type="text"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>

      <form onSubmit={handleSendMessage} className="mb-4">
        <input
          type="text"
          placeholder="Enter message text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="border p-2 rounded mr-2 w-64"
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Send Message
        </button>
      </form>

      {fcmToken && (
        <div className="mb-3 break-all text-xs bg-gray-100 p-2 rounded">
          <strong>FCM Token:</strong> {fcmToken}
        </div>
      )}

      {notification ? (
        <div className="border p-3 rounded bg-gray-100">
          <h3 className="font-bold">{notification.title}</h3>
          <p>{notification.body}</p>
        </div>
      ) : (
        <p>No notifications received yet...</p>
      )}
    </div>
  );
};

export default Notifications;
 