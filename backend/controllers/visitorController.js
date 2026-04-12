// // ================= VISITOR CONTROLLER =================
// const Visitor = require("../models/Visitor"); 
// const Resident = require("../models/Resident");
// const Security = require("../models/Security")

// // ================= ADD VISITOR =================
// const addVisitor = async (req, res) => {
//   try {
//     const { name, email, mobile, visitorType, block, flat, purpose, securityName, securityEmail } = req.body;

//     if (!name || !email || !mobile || !visitorType || !block || !flat || !purpose) {
//       return res.status(400).json({ message: "All visitor fields are required" });
//     }

//     // format block & flat
//     const blockFormatted = block.trim().toUpperCase();
//     const flatFormatted = flat.trim();

//     // find resident by block & flat
//     const resident = await Resident.findOne({
//       flats: { $elemMatch: { block: blockFormatted, flat: flatFormatted } }
//     });

//     if (!resident) {
//       return res.status(404).json({ message: `Resident not found for block ${blockFormatted} flat ${flatFormatted}` });
//     }

//     // Security info fallback
//     const guardName = securityName || req.user?.name || "Security Guard";
//     const guardEmail = securityEmail || req.user?.email || "security@example.com";

//     // create visitor record
//     const visitor = await Visitor.create({
//       name,
//       email,
//       mobile,
//       visitorType,
//       block: blockFormatted,
//       flat: flatFormatted,
//       residentName: resident.name,
//       residentEmail: resident.email.toLowerCase().trim(),
//       purpose,
//       photo: req.file ? `/uploads/visitors/${req.file.filename}` : "",
//       status: "Pending",
//       exitStatus: "Inside",
//       addedBy: guardName,
//       securityEmail: guardEmail
//     });

//     res.status(201).json({ message: "Visitor request sent to resident", visitor });

//   } catch (error) {
//     console.error("ADD VISITOR ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= LIST ALL VISITORS =================
// const getVisitors = async (req, res) => {
//   try {
//     const visitors = await Visitor.find().sort({ createdAt: -1 });
//     res.json(visitors);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= APPROVE VISITOR =================
// const approveVisitor = async (req, res) => {
//   try {
//     const visitor = await Visitor.findById(req.params.id);
//     if (!visitor) return res.status(404).json({ message: "Visitor not found" });

//     visitor.status = "Accepted";
//     visitor.entryTime = new Date();
//     await visitor.save();

//     res.json({ message: "Visitor approved", visitor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= REJECT VISITOR =================
// const rejectVisitor = async (req, res) => {
//   try {
//     const visitor = await Visitor.findById(req.params.id);
//     if (!visitor) return res.status(404).json({ message: "Visitor not found" });

//     visitor.status = "Rejected";
//     await visitor.save();

//     res.json({ message: "Visitor rejected", visitor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= VISITOR EXIT =================
// const exitVisitor = async (req, res) => {
//   try {
//     const visitor = await Visitor.findById(req.params.id);
//     if (!visitor) return res.status(404).json({ message: "Visitor not found" });

//     visitor.exitTime = new Date();
//     visitor.exitStatus = "Exited";
//     await visitor.save();

//     res.json({ message: "Visitor exit recorded", visitor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= GET VISITOR BY EMAIL =================
// const findVisitorByEmail = async (req, res) => {
//   try {
//     const visitor = await Visitor.findOne({ email: req.params.email });
//     if (!visitor) return res.status(404).json({ message: "Visitor not found" });
//     res.json(visitor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= GET VISITORS FOR RESIDENT =================
// const getVisitorsForResident = async (req, res) => {
//   try {
//     const email = req.params.email.toLowerCase().trim();
//     if (!email) return res.status(400).json({ message: "Resident email required" });

//     const visitors = await Visitor.find({ residentEmail: email }).sort({ createdAt: -1 });
//     res.json(visitors);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   addVisitor,
//   getVisitors,
//   approveVisitor,
//   rejectVisitor,
//   exitVisitor,
//   findVisitorByEmail,
//   getVisitorsForResident
// };
const Visitor = require("../models/Visitor");
const Resident = require("../models/Resident");

// ================= ADD VISITOR =================
const addVisitor = async (req, res) => {
  try {
    const { name, email, mobile, visitorType, block, flat, purpose, securityName, securityEmail } = req.body;

    if (!name || !email || !mobile || !visitorType || !block || !flat || !purpose) {
      return res.status(400).json({ message: "All visitor fields are required" });
    }

    const blockFormatted = block.trim().toUpperCase();
    const flatFormatted = flat.trim();

    const resident = await Resident.findOne({
      flats: { $elemMatch: { block: blockFormatted, flat: flatFormatted } }
    });

    if (!resident) {
      return res.status(404).json({ message: "Resident not found" });
    }

    const visitor = await Visitor.create({
      name,
      email,
      mobile,
      visitorType,
      block: blockFormatted,
      flat: flatFormatted,
      residentName: resident.name,
      residentEmail: resident.email.toLowerCase().trim(),
      purpose,
      photo: req.file ? req.file.path : "",   // ✅ CLOUDINARY
      status: "Pending",
      exitStatus: "Inside",
      addedBy: securityName || "Security",
      securityEmail: securityEmail || "security@example.com"
    });

    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= OTHER FUNCTIONS (NO CHANGE) =================

const getVisitors = async (req, res) => {
  const data = await Visitor.find().sort({ createdAt: -1 });
  res.json(data);
};

const approveVisitor = async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Not found" });

  visitor.status = "Accepted";
  visitor.entryTime = new Date();
  await visitor.save();

  res.json(visitor);
};

const rejectVisitor = async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Not found" });

  visitor.status = "Rejected";
  await visitor.save();

  res.json(visitor);
};

const exitVisitor = async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);
  if (!visitor) return res.status(404).json({ message: "Not found" });

  visitor.exitTime = new Date();
  visitor.exitStatus = "Exited";
  await visitor.save();

  res.json(visitor);
};

const findVisitorByEmail = async (req, res) => {
  const data = await Visitor.findOne({ email: req.params.email });
  res.json(data);
};

const getVisitorsForResident = async (req, res) => {
  const email = req.params.email.toLowerCase().trim();
  const data = await Visitor.find({ residentEmail: email }).sort({ createdAt: -1 });
  res.json(data);
};

module.exports = {
  addVisitor,
  getVisitors,
  approveVisitor,
  rejectVisitor,
  exitVisitor,
  findVisitorByEmail,
  getVisitorsForResident
};