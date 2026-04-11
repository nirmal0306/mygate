const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({

  name: { type: String, required: true },
  email: { type: String, required: true },

  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },

  reason: { type: String, required: true },

  status: {
    type: String,
    default: "Pending"
  },

  responseMessage: {
    type: String,
    default: ""
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("LeaveApplication", leaveSchema);