const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getJwtSecret } = require("../config/env");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot be contain "password"');
        }
      },
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    deleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};
adminSchema.methods.generateAuthToken = async function () {
  const user = this;
  const expiresInSeconds = 10 * 60 * 60;

  const expirationDate = new Date();
  expirationDate.setTime(
    expirationDate.getTime() + expiresInSeconds * 1000
  );

  const token = jwt.sign(
    {
      _id: user._id.toString(),
      exp: Math.floor(expirationDate.getTime() / 1000), // Add expiration time to payload
    },
    getJwtSecret()
  );

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return { token, expiresInSeconds };
};
adminSchema.statics.findByEmailId = async (email) => {
  const user = await Admin.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }
  return user;
};
adminSchema.statics.findByCredentials = async (email, password) => {
  const user = await Admin.findOne({ email });

  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash the plain text password before saving
adminSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8); //round or cost factor ->how much time is needed to calculate a single BCrypt hash, default value is 10
  }

  next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
