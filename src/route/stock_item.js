const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const {
  updateStockItemById,
  deleteStockItem,
  addStockItem,
  stockItemByStockId,
  getStockItemRecords,
} = require("../controller/stock_item.controller");

router.post("/add", auth, addStockItem);

router.delete("/delete/:id", auth, deleteStockItem);

router.get("/stock-items-by/:id", auth, stockItemByStockId);

router.patch("/update/:id", auth, updateStockItemById);

router.get("/stock-items", auth, getStockItemRecords);

module.exports = router;
