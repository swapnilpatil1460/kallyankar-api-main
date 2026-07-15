const express = require("express");
require("dotenv").config();

require("./src/db/mongoose");
const cors = require("cors");
const { getCorsOrigins, getJwtSecret } = require("./src/config/env");
const app = express();
const allowedOrigins = getCorsOrigins();
getJwtSecret();
app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin is not allowed by CORS."));
    },
  })
);
const adminRouter = require("./src/route/admin");
const inquiryRouter = require("./src/route/inquiry");
const customerRouter = require("./src/route/customer");
const productRouter = require("./src/route/product");
const batteryTypeRouter = require("./src/route/batteryType");
const amphereRouter = require("./src/route/amphere");
const stockRouter = require("./src/route/stock");
const gstRouter = require("./src/route/gst");
const billingRouter = require("./src/route/billing");
const stockItemRouter = require("./src/route/stock_item");
const invoiceRouter = require("./src/route/invoice");
const scrapRouter = require("./src/route/scrap.route");

app.use("/admin", adminRouter);
app.use("/inquiry", inquiryRouter);
app.use("/customer", customerRouter);
app.use("/product", productRouter);
app.use("/battery-type", batteryTypeRouter);
app.use("/amphere", amphereRouter);
app.use("/stock", stockRouter);
app.use("/gst", gstRouter);
app.use("/billing", billingRouter);
app.use("/stock-item", stockItemRouter);
app.use("/invoice", invoiceRouter);
app.use("/scrap", scrapRouter);
app.use((error, req, res, next) => {
  if (error.message === "Origin is not allowed by CORS.") {
    return res.status(403).send({ error: error.message });
  }
  console.error(error);
  return res.status(500).send({ error: "Internal server error." });
});
const Admin = require("./src/models/admin");

// Auto-create default admin if none exists
const initializeAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultAdmin = new Admin({
        name: "Admin",
        last_name: "User",
        email: "admin@kallyankar.com",
        password: "KallyankarAdmin123!",
        role: "Admin",
        createdBy: "System"
      });
      await defaultAdmin.save();
      console.log("Default admin created successfully.");
    }
  } catch (err) {
    console.error("Error creating default admin:", err);
  }
};
initializeAdmin();

module.exports = app;

