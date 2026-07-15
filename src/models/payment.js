const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    billing_id: {
      type: mongoose.Types.ObjectId,
      ref: "Billing",
      required: true,
    },
    customer_id: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount_paid: {
      type: Number,
      required: true,
    },
    payment_method: {
      type: String,
      default: "Cash", // Cash, UPI, Card, Cheque, Other
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
