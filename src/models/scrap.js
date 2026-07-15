const mongoose = require("mongoose");

const scrapSchema = new mongoose.Schema(
  {
    battery_name: {
      type: String,
      required: true,
      trim: true,
    },
    amphere_size: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    exchange_value: {
      type: Number,
      required: true,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: "Customer",
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

const Scrap = mongoose.model("Scrap", scrapSchema);

module.exports = Scrap;
