/* eslint-disable no-undef */
// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBN8vlzelW0kqY4NIOyu6qnzHjwWJpXlyI",
  authDomain: "hello-27bad.firebaseapp.com",
  projectId: "hello-27bad",
  storageBucket: "hello-27bad.appspot.com",
  messagingSenderId: "100082330049",
  appId: "1:100082330049:web:7d05ee6547b833d745a740"
});

const messaging = firebase.messaging();

// Background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/favicon.ico"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
