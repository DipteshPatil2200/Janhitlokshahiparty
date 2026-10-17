// nikhil

// backend/routes/donations.js
//
// Two endpoints:
//   POST /api/donations/create-order  -> called when user clicks "Donate"
//   POST /api/donations/verify        -> called after Razorpay checkout succeeds
//
// SECURITY RULES (do not relax these):
// 1. The amount is NEVER trusted from a value the frontend could tamper
//    with after order creation — Razorpay ties the payment to the
//    server-created order, not to whatever the frontend claims afterward.
// 2. Signature verification on /verify is mandatory. Skipping it means
//    anyone could POST a fake "success" and your DB would mark it paid.

import type { Request, Response } from "express";

const express = require("express");
const crypto = require("crypto");
const razorpay = require("../utils/razorpay-client");
const Donation = require("../models/Donation.model.js");

const router = express.Router();

// Minimum/maximum donation guardrails — adjust to your needs.
const MIN_AMOUNT_INR = 10;
const MAX_AMOUNT_INR = 500000;

// ---------------------------------------------------------------
// POST /api/donations/create-order
// body: { amount: number (in INR, e.g. 500), name?, email?, phone? }
// ---------------------------------------------------------------
router.post("/create-order", async (req: Request, res: Response) => {
  try {
    const { amount, name, email, phone } = req.body || {};

    const amountInINR = Number(amount);
    if (
      !amountInINR ||
      amountInINR < MIN_AMOUNT_INR ||
      amountInINR > MAX_AMOUNT_INR
    ) {
      return res.status(400).json({
        error: `Amount must be between ₹${MIN_AMOUNT_INR} and ₹${MAX_AMOUNT_INR}`,
      });
    }

    const amountInPaise = Math.round(amountInINR * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `donation_${Date.now()}`,
      notes: { donorName: name || "", donorEmail: email || "" },
    });

    await Donation.create({
      razorpayOrderId: order.id,
      amountInPaise,
      currency: "INR",
      donorName: name,
      donorEmail: email,
      donorPhone: phone,
      status: "created",
    });

    // Only the public key ID goes to the frontend — never the secret.
    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("[donations/create-order]", err);
    return res.status(500).json({ error: "Could not create donation order" });
  }
});

// ---------------------------------------------------------------
// POST /api/donations/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// ---------------------------------------------------------------
router.post("/verify", async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ error: "Missing payment verification fields" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    const donation = await Donation.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: isValid ? "paid" : "failed",
      },
      { new: true },
    );

    if (!isValid) {
      return res
        .status(400)
        .json({ ok: false, error: "Signature verification failed" });
    }

    if (!donation) {
      // Signature was valid but we somehow don't have a matching order —
      // extremely unlikely, but don't silently succeed.
      return res
        .status(404)
        .json({ ok: false, error: "Donation record not found" });
    }

    return res.json({
      ok: true,
      donationId: donation._id,
      status: donation.status,
    });
  } catch (err) {
    console.error("[donations/verify]", err);
    return res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;
