const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  email: { type: String, required: true },

  flats: [
    {
      block: String,
      flat: String
    }
  ],

  months: [String],

  amount: Number,

  method: {
    type: String,
    enum: ["UPI", "Card"],
    required: true
  },

  // ✅ UPI Details
  upiDetails: {
    upiId: String,
    provider: String
  },

  // ✅ Card Details
  cardDetails: {
    number: String,
    expiry: String,
    cvv: String,
    brand: String
  },

  status: {
    type: String,
    default: "success"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);