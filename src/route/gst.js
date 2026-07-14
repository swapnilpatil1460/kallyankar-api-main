const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const {
  registerNewGST,
  getGSTList,
  deleteGSTItem,
  updateById,
} = require("../controller/gst.controller");

router.post("/add", auth, registerNewGST);

router.delete("/delete/:id", auth, deleteGSTItem);

router.get("/", auth, getGSTList);

router.patch("/update/:id", auth, updateById);

module.exports = router;
