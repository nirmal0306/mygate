const Payment = require("../models/Payment");

exports.makePayment = async (req, res) => {
  try {
    const {
      residentId,
      email,
      flats,
      months,
      amount,
      method,
      upiDetails,
      cardDetails
    } = req.body;

    if (!email || !amount || !method) return res.status(400).json({ message: "Missing required fields" });

    const payment = await Payment.create({
      residentId,
      email,
      flats,
      months,
      amount,
      method,
      upiDetails: upiDetails || null,
      cardDetails: cardDetails || null,
      status: "success"
    });

    res.json({ success: true, message: "Payment Successful", data: payment });

  } catch (err) {
    console.error("PAYMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get payments by resident
exports.getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ residentId: userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};