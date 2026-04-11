const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  securityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Security', // reference to Security collection
    required: true
  },
  name: String,
  email: String,
  months: [String],
  amount: Number,
  method: {
    type: String,
    enum: ['UPI', 'Card'],
    required: true
  },
  upiDetails: {
    upiId: String,
    provider: String
  },
  cardDetails: {
    number: String,
    expiry: String,
    cvv: String
  },
  status: {
    type: String,
    default: "success"
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Salary', salarySchema);