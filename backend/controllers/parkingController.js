const Parking = require("../models/Parking");

// const addParkingRequest = async (req, res) => {
//   try {
//     const { residentName, residentEmail, block, flat, vehicleType, vehicleNumber } = req.body;

//     // check existing request
//     let existing = await Parking.findOne({ residentEmail });

//     if (existing && existing.status === "Rejected") {
//       existing.requestCount += 1;
//       existing.status = "Pending";
//       existing.vehicleType = vehicleType;
//       existing.vehicleNumber = vehicleNumber;
//       await existing.save();

//       return res.json({ message: `Request resent (${existing.requestCount} times)` });
//     }

//     if (existing && existing.status === "Pending") {
//       return res.status(400).json({ message: "Request already pending" });
//     }

//     const parking = await Parking.create({
//       residentName,
//       residentEmail,
//       block,
//       flat,
//       vehicleType,
//       vehicleNumber
//     });

//     res.status(201).json({ message: "Parking request sent", parking });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const addParkingRequest = async (req, res) => {
  try {
    const { residentName, residentEmail, block, flat, vehicleType, vehicleNumber } = req.body;

    // 🔥 COUNT EXISTING PARKINGS
    // const existingCount = await Parking.countDocuments({ residentEmail });
    const existingCount = await Parking.countDocuments({
      residentEmail,
      status: { $in: ["Pending", "Accepted"] }
    });
    
    if (existingCount >= 2) {
      return res.status(400).json({ message: "Maximum 2 parking slots allowed" });
    }

    // OPTIONAL: prevent duplicate vehicle
    const duplicateVehicle = await Parking.findOne({ residentEmail, vehicleNumber });
    if (duplicateVehicle) {
      return res.status(400).json({ message: "Vehicle already registered" });
    }

    const parking = await Parking.create({
      residentName,
      residentEmail,
      block,
      flat,
      vehicleType,
      vehicleNumber
    });

    res.status(201).json({ message: "Parking request sent", parking });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getParkingRequests = async (req, res) => {
  const data = await Parking.find().sort({ createdAt: -1 });
  res.json(data);
};
const approveParking = async (req, res) => {
  try {
    const { parkingNumber } = req.body;

    const parking = await Parking.findById(req.params.id);
    if (!parking) return res.status(404).json({ message: "Not found" });

    parking.status = "Accepted";
    parking.parkingNumber = parkingNumber;

    await parking.save();

    res.json({ message: "Parking Approved", parking });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const rejectParking = async (req, res) => {
  try {
    const parking = await Parking.findById(req.params.id);
    if (!parking) return res.status(404).json({ message: "Not found" });

    parking.status = "Rejected";
    await parking.save();

    res.json({ message: "Parking Rejected", parking });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// const getResidentParking = async (req, res) => {
//   const email = req.params.email.toLowerCase().trim();

//   const data = await Parking.findOne({ residentEmail: email });
//   res.json(data);
// };

const getResidentParking = async (req, res) => {
  const email = req.params.email.toLowerCase().trim();

  const data = await Parking.find({ residentEmail: email }).sort({ createdAt: -1 });

  res.json(data);
};
module.exports = {
  addParkingRequest,
  getParkingRequests,
  approveParking,
  rejectParking,
  getResidentParking
};