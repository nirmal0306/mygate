const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  block: { type: String, required: true },
  flat: { type: String, required: true },
  month: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['UPI','Card','Cash'], required: true },
  upiDetails: {
    upiId: String,
    provider: String
  },
  cardDetails: {
    number: String,
    expiry: String,
    cvv: String,
    brand: String
  },
  status: { type: String, default: "success" },
  date: { type: Date, default: Date.now }
});

const maintenanceSchema = new mongoose.Schema({
  residentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
  payments: [paymentSchema]
}, { timestamps: true });

const maintenanceMonthSchema = new mongoose.Schema({
  month: { type: String, required: true, unique: true },
  ratePerFlat: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports.Maintenance = mongoose.model('Maintenance', maintenanceSchema);
module.exports.MaintenanceMonth = mongoose.model('MaintenanceMonth', maintenanceMonthSchema);