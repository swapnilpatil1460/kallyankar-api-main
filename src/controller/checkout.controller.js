const mongoose = require("mongoose");
const Billing = require("../models/billing");
const Customer = require("../models/customer");
const Product = require("../models/product");

const Stock = require("../models/stock");

const createCheckout = async (req, res) => {
  const { products, billing } = req.body;
  const customerId = billing?.customerId ?? billing?.customer;

  if (!Array.isArray(products) || products.length === 0 || !billing) {
    return res.status(400).send({ message: "Products and billing details are required." });
  }

  if (!mongoose.isValidObjectId(customerId)) {
    return res.status(400).send({ message: "A valid customer is required." });
  }

  const session = await mongoose.startSession();

  try {
    let createdProducts;
    let createdBilling;

    await session.withTransaction(async () => {
      const customerExists = await Customer.exists({ _id: customerId }).session(session);
      if (!customerExists) throw new Error("Customer not found.");

      const productDocuments = products.map(({ _id, customer, ...product }) => ({
        ...product,
        customer: customerId,
      }));
      createdProducts = await Product.insertMany(productDocuments, { session });

      const { _id, customerId: ignoredCustomerId, customer, ...billingDetails } = billing;
      [createdBilling] = await Billing.create(
        [{ ...billingDetails, customer: customerId }],
        { session }
      );

      // Auto-decrease stock for each sold product
      for (const product of products) {
        const quantitySold = product.quantity || 1;
        const stockRecord = await Stock.findOne({
          battery_name: product.name,
          amphere_size: product.type,
        }).session(session);

        if (stockRecord && stockRecord.available >= quantitySold) {
          stockRecord.available -= quantitySold;
          await stockRecord.save({ session });
        }
      }
    });

    return res.status(201).send({
      message: "Sale created successfully.",
      products: createdProducts,
      billing: createdBilling,
    });
  } catch (error) {
    const status = error.message === "Customer not found." ? 404 : 400;
    return res.status(status).send({ message: error.message || "Unable to create sale." });
  } finally {
    await session.endSession();
  }
};

module.exports = { createCheckout };
