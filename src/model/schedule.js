const mongoose = require("mongoose");

const schedule = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.ObjectId,
      ref: "Account",
    },
    title: {
      type: String,
      required: [true, "Title required"],
    },
    date: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
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

const Schedule = mongoose.model("Schedule", schedule);

module.exports = Schedule;
