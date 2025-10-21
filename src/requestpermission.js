
import { messaging, getToken } from "../src/Componets/firebase";

export const requestPermission = async () => {
  console.log("Requesting notification permission...");
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BO8udPVCER5sfE-uwqzjHRuyH-qQZc8Kf9JQQKuX7GGTPRRA34UbJPpbZhX0TMxqh4_MAVnFM7eWC5gSTdtTPhs",
    });
    console.log("FCM Token:", token);
    alert("FCM Token: " + token);
    return token;
  } else {
    console.log("Notification permission not granted.");
    return null;
  }
};
