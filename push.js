const push = require("web-push");

const vapIdKeys = {
  publicKey:
    "BEV0UUVQ_akT0b0168P6JVwebBpOqLtbl7-kejmlUijGA01VtfkXR7irgn9yLwZhYvO3FZVnn_7mVyRd9Jv85Zw",
  privateKey: "XWEp-5Dk_Uns7QN6TmXK4Z_VDz0UL0XjLtAHdPoeHS0",
};

push.setVapidDetails(
  "mailto:tijs.martens.tijs@gmail.com",
  vapIdKeys.publicKey,
  vapIdKeys.privateKey
);

// should come from the database
// this data in sub is coppied from the '    console.log(JSON.stringify(push))      ' line in the frontend
const sub = {
  endpoint:
    "https://fcm.googleapis.com/fcm/send/c5znBINY_1A:APA91bHXJBjck8vMrA2a80QImRTUxe15TAcCjDT3m3iu3TjIQ7Wy5J0fGo2OLvrCwpIALb2tIKHlk9ibfDUE4Fw5q9OPZyKqAxyRghmZI58hHvmd6Bo7McVmibBKpOr5R9Mei2BF2FFy",
  expirationTime: null,
  keys: {
    p256dh:
      "BDQkRA6xD0aNvqSlvhjdibpV8a10f1fhGw50bAd025pZgYqtBmKSTh95vMLUaXCZE7frhT-PpjZBHBcmZpHVwI4",
    auth: "SgWidN0l8Y5J2PaisRSs-Q",
  },
};
push.sendNotification(sub, "test message");
