const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.sendNotification = functions.https.onCall(async (data, context) => {
  try {
    const { token, title, body } = data;

    if (!token || !title || !body) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing token, title, or body"
      );
    }

    const message = { token, notification: { title, body } };

    await admin.messaging().send(message);

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
