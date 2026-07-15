const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoice_number: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", invoiceSchema);
module.exports = Invoice;
