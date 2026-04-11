// const Salary = require('../models/Salary');
// const Security = require('../models/Security');

// // ================= PAY SALARY =================
// exports.paySalary = async (req, res) => {
//   try {
//     const {
//       securityId,
//       name,
//       email,
//       months,
//       amount,
//       method,
//       upiDetails,
//       cardDetails
//     } = req.body;

//     // basic validation
//     if (!securityId || !months || !amount || !method) {
//       return res.status(400).json({ message: "All required fields must be provided" });
//     }

//     // check if security exists
//     const sec = await Security.findById(securityId);
//     if (!sec) return res.status(404).json({ message: "Security user not found" });

//     // create salary record
//     const salary = await Salary.create({
//       securityId,
//       name: name || sec.name,
//       email: email || sec.email,
//       months,
//       amount,
//       method,
//       upiDetails: upiDetails || null,
//       cardDetails: cardDetails || null,
//       status: "success"
//     });

//     res.json({ message: "Salary Paid Successfully", salary });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // ================= GET ALL =================
// exports.getAllSalary = async (req, res) => {
//   try {
//     const data = await Salary.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching salary data" });
//   }
// };

// // ================= GET PAID MONTHS =================
// exports.getPaidMonths = async (req, res) => {
//   try {
//     // fetch all salaries and group by security
//     const salaries = await Salary.find();

//     const paidData = salaries.reduce((acc, curr) => {
//       const id = curr.securityId.toString();
//       if (!acc[id]) {
//         acc[id] = new Set();
//       }
//       curr.months.forEach(month => acc[id].add(month));
//       return acc;
//     }, {});

//     // convert sets to arrays
//     const result = Object.keys(paidData).map(secId => ({
//       securityId: secId,
//       paidMonths: Array.from(paidData[secId])
//     }));

//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching paid months" });
//   }
// };

// // ================= GET SALARY FOR SINGLE SECURITY =================
// exports.getSalaryBySecurity = async (req, res) => {
//   try {
//     const { securityId } = req.params;
//     if (!securityId) return res.status(400).json({ message: "Security ID is required" });

//     const salaries = await Salary.find({ securityId }).sort({ createdAt: -1 });
//     res.json(salaries);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching salary data" });
//   }
// };
const Salary = require('../models/Salary');
const Security = require('../models/Security');

const ALL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// ================= PAY SALARY =================
exports.paySalary = async (req, res) => {
  try {
    const {
      securityId,
      name,
      email,
      months,
      amount,
      method,
      upiDetails,
      cardDetails
    } = req.body;

    if (
      !securityId ||
      !Array.isArray(months) ||
      months.length === 0 ||
      !amount ||
      !method
    ) {
      return res.status(400).json({
        message: "securityId, months, amount and method are required"
      });
    }

    const sec = await Security.findById(securityId);
    if (!sec) {
      return res.status(404).json({ message: "Security user not found" });
    }

    const previousPayments = await Salary.find({ securityId });

    const alreadyPaidSet = new Set();
    previousPayments.forEach(record => {
      (record.months || []).forEach(month => alreadyPaidSet.add(month));
    });

    const duplicateMonths = months.filter(month => alreadyPaidSet.has(month));
    if (duplicateMonths.length > 0) {
      return res.status(409).json({
        message: `Salary already paid for: ${duplicateMonths.join(', ')}`,
        duplicateMonths
      });
    }

    const salary = await Salary.create({
      securityId,
      name: name || sec.name,
      email: email || sec.email,
      months,
      amount,
      method,
      upiDetails: upiDetails || null,
      cardDetails: cardDetails || null,
      status: "success"
    });

    res.json({
      message: "Salary paid successfully",
      salary
    });
  } catch (err) {
    console.error("paySalary error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL =================
exports.getAllSalary = async (req, res) => {
  try {
    const data = await Salary.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("getAllSalary error:", err);
    res.status(500).json({ message: "Error fetching salary data" });
  }
};

// ================= GET PAID + UNPAID MONTHS =================
exports.getPaidMonths = async (req, res) => {
  try {
    const securities = await Security.find({}, "_id name email");
    const salaries = await Salary.find({}, "securityId months");

    const paidMap = {};

    salaries.forEach(record => {
      const secId = record.securityId.toString();

      if (!paidMap[secId]) {
        paidMap[secId] = new Set();
      }

      (record.months || []).forEach(month => {
        paidMap[secId].add(month);
      });
    });

    const result = securities.map(sec => {
      const secId = sec._id.toString();
      const paidMonths = paidMap[secId] ? Array.from(paidMap[secId]) : [];
      const unpaidMonths = ALL_MONTHS.filter(month => !paidMonths.includes(month));

      return {
        securityId: secId,
        name: sec.name,
        email: sec.email,
        paidMonths,
        unpaidMonths
      };
    });

    res.json(result);
  } catch (err) {
    console.error("getPaidMonths error:", err);
    res.status(500).json({ message: "Error fetching paid months" });
  }
};

// ================= GET SALARY FOR SINGLE SECURITY =================
exports.getSalaryBySecurity = async (req, res) => {
  try {
    const { securityId } = req.params;

    if (!securityId) {
      return res.status(400).json({ message: "Security ID is required" });
    }

    const salaries = await Salary.find({ securityId }).sort({ createdAt: -1 });
    res.json(salaries);
  } catch (err) {
    console.error("getSalaryBySecurity error:", err);
    res.status(500).json({ message: "Error fetching salary data" });
  }
};