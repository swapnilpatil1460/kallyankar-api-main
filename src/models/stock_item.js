const mongoose = require("mongoose");
const stockItemSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    stock: {
      type: mongoose.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);
const StockItem = mongoose.model("StockItem", stockItemSchema);

module.exports = StockItem;
