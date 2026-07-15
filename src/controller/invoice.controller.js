const Invoice = require("../models/invoice");

const getInvoiceNumber = async (req, res) => {
  try {
    let invoice = await Invoice.findOne();
    if (!invoice) {
      invoice = new Invoice({ invoice_number: 1 });
      await invoice.save();
    }
    res.status(200).send({ invoice_number: invoice.invoice_number });
  } catch (e) {
    res.status(400).send(e);
  }
};

const postIncreamentInvoiceNumber = async (req, res) => {
  try {
    let invoice = await Invoice.findOne();
    if (!invoice) {
      invoice = new Invoice({ invoice_number: 1 });
    } else {
      invoice.invoice_number += 1;
    }
    await invoice.save();
    res.status(200).send({ invoice_number: invoice.invoice_number });
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  getInvoiceNumber,
  postIncreamentInvoiceNumber,
};
