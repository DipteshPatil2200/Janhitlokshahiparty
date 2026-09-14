//nikhil

// backend/models/Donation.js
//
// Stores every donation attempt (pending, paid, or failed) so you have a
// full record even for payments the user abandoned mid-checkout.

const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // Razorpay identifiers
    razorpayOrderId: { type: String, required: true, unique: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    // Amount is stored in the smallest currency unit (paise) to avoid
    // floating point issues, same convention Razorpay itself uses.
    amountInPaise: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // Donor info (all optional except what your form actually requires)
    donorName: { type: String },
    donorEmail: { type: String },
    donorPhone: { type: String },

    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },

    // Raw webhook/verify payloads kept for audit/debugging if needed
    notes: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Donation", donationSchema);
