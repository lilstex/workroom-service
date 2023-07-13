const mongoose = require("mongoose");

const client = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
    },
    email: {
      type: String,
      unique: true,
      required: [true, "user must have email"],
    },
    phone: {
      type: String,
    },
    name: {
      type: String,
    },
    address: {
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

const Client = mongoose.model("Client", client);

client.index({
  email: "text",
});

module.exports = Client;
