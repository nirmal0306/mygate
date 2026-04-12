// const Resident = require("../models/Resident");

// // ================= ADD RESIDENT =================
// const addResident = async (req, res) => {
//   try {
//     const { name, email, mobile, flats, faceDescriptor } = req.body;

//     if (!name || !email || !mobile || !flats || !faceDescriptor) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const flatsArray = JSON.parse(flats);
//     const parsedDescriptor = JSON.parse(faceDescriptor);

//     if (!Array.isArray(flatsArray) || flatsArray.length === 0) {
//       return res.status(400).json({ message: "Flats data is required" });
//     }

//     if (!Array.isArray(parsedDescriptor) || parsedDescriptor.length !== 128) {
//       return res.status(400).json({ message: "Invalid face descriptor" });
//     }

//     for (const f of flatsArray) {
//       if (!f.block || !f.flat || !f.type) {
//         return res.status(400).json({
//           message: "Each flat must have block, flat and resident type"
//         });
//       }
//     }

//     const resident = await Resident.create({
//       name,
//       email,
//       mobile,
//       flats: flatsArray,
//       faceDescriptor: parsedDescriptor,
//       photo: req.file ? `/uploads/residents/${req.file.filename}` : ""
//     });

//     res.status(201).json(resident);
//   } catch (error) {
//     console.error("ADD RESIDENT ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= LIST RESIDENTS =================
// const getResidents = async (req, res) => {
//   try {
//     const residents = await Resident.find().sort({ createdAt: -1 });
//     res.json(residents);
//   } catch (error) {
//     console.error("GET RESIDENTS ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= GET RESIDENT BY ID =================
// const getResidentById = async (req, res) => {
//   try {
//     const resident = await Resident.findById(req.params.id);
//     if (!resident) return res.status(404).json({ message: "Resident not found" });
//     res.json(resident);
//   } catch (error) {
//     console.error("GET RESIDENT ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= GET RESIDENT BY EMAIL =================
// const getResidentByEmail = async (req, res) => {
//   try {
//     const resident = await Resident.findOne({ email: req.params.email });
//     if (!resident) return res.status(404).json({ message: "Resident not found" });
//     res.json(resident);
//   } catch (error) {
//     console.error("GET RESIDENT BY EMAIL ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= UPDATE RESIDENT =================
// const updateResident = async (req, res) => {
//   try {
//     const resident = await Resident.findById(req.params.id);
//     if (!resident) return res.status(404).json({ message: "Resident not found" });

//     resident.name = req.body.name || resident.name;
//     resident.email = req.body.email || resident.email;
//     resident.mobile = req.body.mobile || resident.mobile;

//     if (req.body.flats) {
//       const flatsArray = JSON.parse(req.body.flats);
//       for (const f of flatsArray) {
//         if (!f.block || !f.flat || !f.type) {
//           return res.status(400).json({
//             message: "Each flat must have block, flat and resident type"
//           });
//         }
//       }
//       resident.flats = flatsArray;
//     }

//     if (req.body.faceDescriptor) {
//       const parsedDescriptor = JSON.parse(req.body.faceDescriptor);
//       if (!Array.isArray(parsedDescriptor) || parsedDescriptor.length !== 128) {
//         return res.status(400).json({ message: "Invalid face descriptor" });
//       }
//       resident.faceDescriptor = parsedDescriptor;
//     }

//     if (req.file) {
//       resident.photo = `/uploads/residents/${req.file.filename}`;
//     }

//     const updatedResident = await resident.save();
//     res.json(updatedResident);
//   } catch (error) {
//     console.error("UPDATE RESIDENT ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= DELETE RESIDENT =================
// const deleteResident = async (req, res) => {
//   try {
//     const resident = await Resident.findByIdAndDelete(req.params.id);
//     if (!resident) return res.status(404).json({ message: "Resident not found" });
//     res.json({ message: "Resident deleted successfully" });
//   } catch (error) {
//     console.error("DELETE RESIDENT ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   addResident,
//   getResidents,
//   getResidentById,
//   getResidentByEmail,
//   updateResident,
//   deleteResident
// };
const Resident = require("../models/Resident");

// ================= ADD RESIDENT =================
const addResident = async (req, res) => {
  try {
    const { name, email, mobile, flats, faceDescriptor } = req.body;

    if (!name || !email || !mobile || !flats || !faceDescriptor) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const flatsArray = JSON.parse(flats);
    const parsedDescriptor = JSON.parse(faceDescriptor);

    if (!Array.isArray(flatsArray) || flatsArray.length === 0) {
      return res.status(400).json({ message: "Flats data is required" });
    }

    if (!Array.isArray(parsedDescriptor) || parsedDescriptor.length !== 128) {
      return res.status(400).json({ message: "Invalid face descriptor" });
    }

    const resident = await Resident.create({
      name,
      email,
      mobile,
      flats: flatsArray,
      faceDescriptor: parsedDescriptor,
      photo: req.file ? req.file.path : ""   // ✅ CLOUDINARY URL
    });

    res.status(201).json(resident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET RESIDENTS =================
const getResidents = async (req, res) => {
  try {
    const data = await Resident.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY ID =================
const getResidentById = async (req, res) => {
  try {
    const data = await Resident.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY EMAIL =================
const getResidentByEmail = async (req, res) => {
  try {
    const data = await Resident.findOne({ email: req.params.email });
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE =================
const updateResident = async (req, res) => {
  try {
    const resident = await Resident.findById(req.params.id);
    if (!resident) return res.status(404).json({ message: "Not found" });

    resident.name = req.body.name || resident.name;
    resident.email = req.body.email || resident.email;
    resident.mobile = req.body.mobile || resident.mobile;

    if (req.body.flats) {
      resident.flats = JSON.parse(req.body.flats);
    }

    if (req.body.faceDescriptor) {
      resident.faceDescriptor = JSON.parse(req.body.faceDescriptor);
    }

    if (req.file) {
      resident.photo = req.file.path;   // ✅ CLOUDINARY
    }

    const updated = await resident.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE =================
const deleteResident = async (req, res) => {
  try {
    await Resident.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addResident,
  getResidents,
  getResidentById,
  getResidentByEmail,
  updateResident,
  deleteResident
};