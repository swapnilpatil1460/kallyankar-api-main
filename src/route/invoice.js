const express = require("express");
const auth = require("../middleware/auth");
const {
  getInvoiceNumber,
  postIncreamentInvoiceNumber,
} = require("../controller/invoice.controller");

const router = new express.Router();

router.get("/", auth, getInvoiceNumber);
router.post("/", auth, postIncreamentInvoiceNumber);

module.exports = router;
