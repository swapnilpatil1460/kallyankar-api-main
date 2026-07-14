const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const {
  registerNewStockElement,
  getAllStockElements,
  deleteStockElement,
  updateById,
} = require("../controller/stock.controller");

router.post("/add", auth, registerNewStockElement);

router.delete("/delete/:id", auth, deleteStockElement);

router.get("/list", auth, getAllStockElements);

router.patch("/update/:id", auth, updateById);

module.exports = router;
