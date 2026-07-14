const auth = require("../middleware/auth");
const express = require("express");
const {
  updateBillingById,
  deleteBilling,
  addBilling,
  getBillingRecords,
  billintByCustomerId,
  getBillingRecordsByStatus,
} = require("../controller/billing.controller");
const { createCheckout } = require("../controller/checkout.controller");

const router = new express.Router();
router.post("/add", auth, addBilling);
router.post("/checkout", auth, createCheckout);
router.get("/get-list", auth, getBillingRecords);
router.get(
  "/get-list-by-status/:billing_status",
  auth,
  getBillingRecordsByStatus
);
router.get("/customer-specific-list/:id", auth, billintByCustomerId);
router.delete("/delete/:productId", auth, deleteBilling);
router.patch("/update/:id", auth, updateBillingById);
module.exports = router;
