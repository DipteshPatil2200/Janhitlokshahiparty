//nikhil

// backend/utils/razorpay-client.js
//
// Single shared Razorpay instance. Never import the secret key anywhere
// outside the backend — it must never reach the frontend bundle.

const Razorpay = require("razorpay");

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn(
    "[razorpay] RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set. " +
      "Donation payment endpoints will fail until these are configured in .env"
  );
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;