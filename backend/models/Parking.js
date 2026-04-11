const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
  residentName: String,
  residentEmail: String,
  block: String,
  flat: String,

  vehicleType: String,
  vehicleNumber: String,

  status: {
    type: String,
    default: "Pending" // Pending, Accepted, Rejected
  },

  parkingNumber: {
    type: String,
    default: ""
  },

  requestCount: {
    type: Number,
    default: 1
  }

}, { timestamps: true });

module.exports = mongoose.model("Parking", parkingSchema);