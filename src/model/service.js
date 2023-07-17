const mongoose = require("mongoose");

const service = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
    },
    serviceName: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    numOfInvoices: {
        type: Number,
        default: 0,
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

const Service = mongoose.model("Service", service);

module.exports = Service;
