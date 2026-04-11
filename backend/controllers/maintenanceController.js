const { Maintenance, MaintenanceMonth } = require('../models/Maintenance');
const Resident = require('../models/Resident');
const Payment = require('../models/Payment');

// ================= RECORD PAYMENT =================
exports.recordPayment = async (req, res) => {
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

    if (!residentId || !email || !flats || !months || !amount || !method) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const resident = await Resident.findById(residentId);
    if (!resident) return res.status(404).json({ message: "Resident not found" });

    let maintenance = await Maintenance.findOne({ residentId });
    if (!maintenance) maintenance = new Maintenance({ residentId, payments: [] });

    const perMonthAmount = amount / (flats.length * months.length);

    flats.forEach(f => {
      months.forEach(m => {
        const exists = maintenance.payments.some(p =>
          p.block === f.block && p.flat === f.flat && p.month === m
        );
        if (!exists) {
          maintenance.payments.push({
            block: f.block,
            flat: f.flat,
            month: m,
            amount: perMonthAmount,
            method,
            upiDetails: upiDetails || null,
            cardDetails: cardDetails || null,
            status: "success",
            date: new Date()
          });
        }
      });
    });

    await maintenance.save();

    // Also create a Payment record for logging
    const paymentLog = await Payment.create({
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

    res.json({
      message: "Payment recorded successfully",
      payment: paymentLog
    });

  } catch (err) {
    console.error("RECORD PAYMENT ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================= GET MAINTENANCE DATA =================
exports.getMaintenanceData = async (req, res) => {
  try {
    const { residentId } = req.query;
    if (!residentId) return res.status(400).json({ message: "residentId is required" });

    const resident = await Resident.findById(residentId);
    if (!resident) return res.status(404).json({ message: "Resident not found" });

    const maintenance = await Maintenance.findOne({ residentId });

    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentDate = now.getDate();

    const monthNames = [
      "January","February","March","April","May","June",
      "July","August","September","October","November","December"
    ];

    const flatStatus = resident.flats.map(f => {
      const paidMonths = maintenance?.payments
        .filter(p => p.block === f.block && p.flat === f.flat)
        .map(p => p.month) || [];

      let unpaidMonths = [];

      monthNames.forEach((m, index) => {
        if (index > currentMonthIndex) return;
        if (!paidMonths.includes(m)) {
          if (index === currentMonthIndex && currentDate <= 15) return;
          unpaidMonths.push(m);
        }
      });

      if (currentDate <= 15 && currentMonthIndex > 0) {
        const prevMonth = monthNames[currentMonthIndex - 1];
        if (!paidMonths.includes(prevMonth) && !unpaidMonths.includes(prevMonth)) {
          unpaidMonths.push(prevMonth);
        }
      }

      return {
        block: f.block,
        flat: f.flat,
        paidMonths: Array.from(new Set(paidMonths)),
        unpaidMonths
      };
    });

    const payments = maintenance?.payments.map(p => ({
      block: p.block,
      flat: p.flat,
      month: p.month,
      amount: p.amount,
      method: p.method,
      upiDetails: p.upiDetails || null,
      cardDetails: p.cardDetails || null,
      date: p.date,
      status: p.status
    })) || [];

    const paidMonths = Array.from(new Set(flatStatus.flatMap(f => f.paidMonths)));
    const unpaidMonths = Array.from(new Set(flatStatus.flatMap(f => f.unpaidMonths)));

    res.json({
      resident: {
        name: resident.name,
        email: resident.email,
        flats: resident.flats
      },
      payments,
      flatStatus,
      paidMonths,
      unpaidMonths
    });

  } catch (err) {
    console.error("GET MAINTENANCE DATA ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================= Other functions (add month, get all records, paid/unpaid months) remain the same =================
// ================= ADD MAINTENANCE MONTH =================
exports.addMaintenanceMonth = async (req, res) => {
  try {
    const { month, ratePerFlat } = req.body;
    if (!month || !ratePerFlat) return res.status(400).json({ message: "Month and rate are required" });

    const exists = await MaintenanceMonth.findOne({ month });
    if (exists) return res.status(400).json({ message: "Maintenance for this month already exists" });

    const newMonth = new MaintenanceMonth({ month, ratePerFlat });
    await newMonth.save();
    res.json({ message: "Maintenance month added successfully", newMonth });
  } catch (err) {
    console.error("ADD MAINTENANCE MONTH ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ================= GET ALL MAINTENANCE RECORDS =================
exports.getAllMaintenanceData = async (req, res) => {
  try {
    const allMaintenance = await Maintenance.find().populate('residentId', 'name email flats');
    res.json(allMaintenance);
  } catch (err) {
    console.error("GET ALL MAINTENANCE DATA ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ================= GET ALL MAINTENANCE MONTHS =================
exports.getMaintenanceMonths = async (req, res) => {
  try {
    const months = await MaintenanceMonth.find().sort({ createdAt: 1 });
    res.json(months);
  } catch (err) {
    console.error("GET MAINTENANCE MONTHS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ONLY PAID MONTHS =================
exports.getPaidMonths = async (req, res) => {
  try {
    const { residentId } = req.query;
    if (!residentId) return res.status(400).json({ message: "residentId is required" });

    const resident = await Resident.findById(residentId);
    if (!resident) return res.status(404).json({ message: "Resident not found" });

    const maintenance = await Maintenance.findOne({ residentId: resident._id });
    const paidMonthsSet = new Set(maintenance?.payments.map(p => p.month) || []);

    res.json({ paidMonths: Array.from(paidMonthsSet) });
  } catch (err) {
    console.error("GET PAID MONTHS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ONLY UNPAID MONTHS =================
exports.getUnpaidMonths = async (req, res) => {
  try {
    const { residentId } = req.query;
    if (!residentId) return res.status(400).json({ message: "residentId is required" });

    const resident = await Resident.findById(residentId);
    if (!resident) return res.status(404).json({ message: "Resident not found" });

    const months = await MaintenanceMonth.find().sort({ createdAt: 1 });
    const monthNames = months.map(m => m.month);

    const maintenance = await Maintenance.findOne({ residentId: resident._id });
    const paidMonths = maintenance?.payments.map(p => p.month) || [];
    const unpaidMonths = monthNames.filter(m => !paidMonths.includes(m));

    res.json({ unpaidMonths });
  } catch (err) {
    console.error("GET UNPAID MONTHS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getAllMaintenance = async (req, res) => {
  try {

    const data = await Maintenance.find()
      .populate('residentId', 'name') // 👈 get resident name
      .sort({ createdAt: -1 });

    let result = [];

    data.forEach(record => {

      record.payments.forEach(p => {

        result.push({
          residentName: record.residentId?.name || 'Unknown',
          block: p.block,
          flat: p.flat,
          month: p.month,
          amount: p.amount,
          method: p.method,
          status: p.status,
          date: p.date
        });

      });

    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching data" });
  }
};


// ================= GET PENDING MAINTENANCE =================
exports.getPendingMaintenance = async (req, res) => {
  try {
    // 1️⃣ Load all residents
    const residents = await Resident.find();
    // 2️⃣ Load all maintenance months
    const months = await MaintenanceMonth.find().sort({ createdAt: 1 });
    const monthNames = months.map(m => m.month);

    let pendingList = [];

    // 3️⃣ Loop through each resident
    for (let resident of residents) {
      // Get maintenance record for resident (may be null)
      const maintenance = await Maintenance.findOne({ residentId: resident._id });
      const paidPayments = maintenance?.payments || [];

      // Loop through each flat of the resident
      resident.flats.forEach(flat => {
        // Loop through all months
        monthNames.forEach(month => {
          // Check if this month is already paid for this flat
          const isPaid = paidPayments.some(p =>
            p.block === flat.block &&
            p.flat === flat.flat &&
            p.month === month &&
            p.status === "success"
          );

          // If not paid, add to pending list
          if (!isPaid) {
            pendingList.push({
              residentName: resident.name,
              email: resident.email,
              block: flat.block,
              flat: flat.flat,
              month: month,
              amount: months.find(m => m.month === month)?.ratePerFlat || 0,
              status: "Pending"
            });
          }
        });
      });
    }

    res.json(pendingList);
  } catch (err) {
    console.error("GET PENDING MAINTENANCE ERROR:", err);
    res.status(500).json({ message: "Error fetching pending maintenance", error: err.message });
  }
};