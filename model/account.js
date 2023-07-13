const mongoose = require("mongoose");

const account = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "user must have email"],
    },
    phone: {
      type: String,
    },
    fullName: {
      type: String,
    },
    companyName: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
    tinNumber: {
      type: String,
    },
    website: {
      type: String,
    },
    accNumber: {
      type: String,
    },
    bankName: {
      type: String,
    },
    logoUrl: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    emailCode: {
      type: Number,
    },
    passwordCode: {
      type: Number,
    },
    passwordResetCodeExpiresAt: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Account = mongoose.model("Account", account);

account.index({
  email: "text",
  username: "text",
});

module.exports = Account;
