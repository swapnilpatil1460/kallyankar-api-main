const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");
const { getJwtSecret } = require("../config/env");

const auth = async (req, res, next) => {
  try {
    const authorization = req.header("Authorization");
    if (!authorization?.startsWith("Bearer ")) throw new Error();
    const token = authorization.slice("Bearer ".length);

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await Admin.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;

//mongodb://localhost:27017
