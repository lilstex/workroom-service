const mongoose = require("mongoose");

const invoice = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
    },
    service: {
      type: String,
    },
    products: {
      type: Array,
    },
    invoiceNumber: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    issuedDate: {
      type: Date,
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "Client",
    },
    signer: {
      type: String,
    },
    signerRole: {
      type: String,
    },
    subTotal: {
      type: String,
    },
    discount: {
      type: String,
    },
    tax: {
      type: String,
    },
    grandTotal: {
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

const Invoice = mongoose.model("Invoice", invoice);

module.exports = Invoice;
