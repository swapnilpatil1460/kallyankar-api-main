const mongoose = require("mongoose");
const Payment = require("../models/payment");
const Billing = require("../models/billing");

const addPayment = async (req, res) => {
  const { billing_id, customer_id, amount_paid, payment_method } = req.body;

  if (!billing_id || !customer_id || amount_paid === undefined) {
    return res.status(400).send({ message: "Missing required fields" });
  }

  const session = await mongoose.startSession();

  try {
    let paymentRecord;
    let updatedBilling;

    await session.withTransaction(async () => {
      // 1. Create payment record
      [paymentRecord] = await Payment.create(
        [{ billing_id, customer_id, amount_paid, payment_method }],
        { session }
      );

      // 2. Update billing's unpaid_amount
      const billing = await Billing.findById(billing_id).session(session);
      if (!billing) {
        throw new Error("Billing record not found");
      }

      billing.unpaid_amount -= amount_paid;
      if (billing.unpaid_amount <= 0) {
        billing.unpaid_amount = 0;
        billing.bill_status = "Paid";
      }

      await billing.save({ session });
      updatedBilling = billing;
    });

    res.status(201).send({
      message: "Payment successfully recorded",
      payment: paymentRecord,
      billing: updatedBilling,
    });
  } catch (e) {
    res.status(400).send({ message: "Error recording payment", error: e.message });
  } finally {
    await session.endSession();
  }
};

const getPaymentsByBillingId = async (req, res) => {
  try {
    const billing_id = req.params.billing_id;
    const payments = await Payment.find({ billing_id, deleted: false }).sort({ createdAt: -1 });
    res.status(200).send(payments);
  } catch (e) {
    res.status(400).send({ message: "Error fetching payments", error: e.message });
  }
};

module.exports = {
  addPayment,
  getPaymentsByBillingId,
};
