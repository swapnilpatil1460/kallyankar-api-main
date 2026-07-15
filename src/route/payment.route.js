const express = require("express");
const auth = require("../middleware/auth");
const { addPayment, getPaymentsByBillingId } = require("../controller/payment.controller");

const router = new express.Router();

router.post("/add", auth, addPayment);
router.get("/billing/:billing_id", auth, getPaymentsByBillingId);

module.exports = router;
