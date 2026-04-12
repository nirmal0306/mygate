
// const Security = require("../models/Security");
// const fs = require('fs');
// const path = require('path');

// // ================= ADD SECURITY =================
// const addSecurity = async (req, res) => {
//   try {
//     const { name, email, mobile, shift, faceDescriptor } = req.body;

//     // Validate required fields
//     if (!name || !email || !mobile || !shift || !faceDescriptor) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const parsedDescriptor = JSON.parse(faceDescriptor);
//     if (!Array.isArray(parsedDescriptor) || parsedDescriptor.length !== 128) {
//       return res.status(400).json({ message: "Invalid face descriptor" });
//     }

//     const security = await Security.create({
//       name,
//       email,
//       mobile,
//       shift,
//       faceDescriptor: parsedDescriptor,
//       photo: req.file ? `/uploads/security/${req.file.filename}` : ""
//     });

//     res.status(201).json(security);
//   } catch (error) {
//     console.error("ADD SECURITY ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= LIST SECURITIES =================
// const getSecurities = async (req, res) => {
//   try {
//     const securities = await Security.find().sort({ createdAt: -1 });
//     res.json(securities);
//   } catch (error) {
//     console.error("GET SECURITIES ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= GET SECURITY BY ID =================
// const getSecurityById = async (req, res) => {
//   try {
//     const security = await Security.findById(req.params.id);
//     if (!security) {
//       return res.status(404).json({ message: "Security not found" });
//     }
//     res.json(security);
//   } catch (error) {
//     console.error("GET SECURITY ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
// // ================= GET SECURITY BY EMAIL =================
// const getSecurityByEmail = async (req, res) => {
//   try {
//     const security = await Security.findOne({ email: req.params.email });

//     if (!security) {
//       return res.status(404).json({ message: "Security not found" });
//     }

//     res.json(security);

//   } catch (error) {
//     console.error("GET SECURITY BY EMAIL ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= UPDATE SECURITY =================
// const updateSecurity = async (req, res) => {
//   try {
//     const security = await Security.findById(req.params.id);
//     if (!security) {
//       return res.status(404).json({ message: "Security not found" });
//     }

//     // Update fields if provided
//     security.name = req.body.name || security.name;
//     security.email = req.body.email || security.email;
//     security.mobile = req.body.mobile || security.mobile;
//     security.shift = req.body.shift || security.shift;

//     // Update face descriptor if provided
//     if (req.body.faceDescriptor) {
//       const parsedDescriptor = JSON.parse(req.body.faceDescriptor);
//       if (!Array.isArray(parsedDescriptor) || parsedDescriptor.length !== 128) {
//         return res.status(400).json({ message: "Invalid face descriptor" });
//       }
//       security.faceDescriptor = parsedDescriptor;
//     }

//     // Update photo if new file uploaded
//     if (req.file) {
//       if (security.photo) {
//         const oldPath = path.join(__dirname, '..', security.photo);
//         fs.unlink(oldPath, err => { if(err) console.error(err); });
//       }
//       security.photo = `/uploads/security/${req.file.filename}`;
//     }

//     const updatedSecurity = await security.save();
//     res.json(updatedSecurity);
//   } catch (error) {
//     console.error("UPDATE SECURITY ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ================= DELETE SECURITY =================
// const deleteSecurity = async (req, res) => {
//   try {
//     const security = await Security.findById(req.params.id);
//     if (!security) {
//       return res.status(404).json({ message: "Security not found" });
//     }

//     // Delete photo file if exists
//     if (security.photo) {
//       const photoPath = path.join(__dirname, '..', security.photo);
//       fs.unlink(photoPath, err => { if (err) console.error(err); });
//     }

//     await security.deleteOne();
//     res.json({ message: "Security deleted successfully" });
//   } catch (error) {
//     console.error("DELETE SECURITY ERROR:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   addSecurity,
//   getSecurities,
//   getSecurityById,
//   getSecurityByEmail,
//   updateSecurity,
//   deleteSecurity
// };
const Security = require("../models/Security");

// ================= ADD SECURITY =================
const addSecurity = async (req, res) => {
  try {
    const { name, email, mobile, shift, faceDescriptor } = req.body;

    if (!name || !email || !mobile || !shift || !faceDescriptor) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parsedDescriptor = JSON.parse(faceDescriptor);

    if (!Array.isArray(parsedDescriptor) || parsedDescriptor.length !== 128) {
      return res.status(400).json({ message: "Invalid face descriptor" });
    }

    const security = await Security.create({
      name,
      email,
      mobile,
      shift,
      faceDescriptor: parsedDescriptor,

      // ✅ CLOUDINARY IMAGE URL
      photo: req.file ? req.file.path : ""
    });

    res.status(201).json(security);
  } catch (error) {
    console.error("ADD SECURITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= LIST SECURITIES =================
const getSecurities = async (req, res) => {
  try {
    const securities = await Security.find().sort({ createdAt: -1 });
    res.json(securities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY ID =================
const getSecurityById = async (req, res) => {
  try {
    const security = await Security.findById(req.params.id);

    if (!security) {
      return res.status(404).json({ message: "Security not found" });
    }

    res.json(security);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET BY EMAIL =================
const getSecurityByEmail = async (req, res) => {
  try {
    const security = await Security.findOne({ email: req.params.email });

    if (!security) {
      return res.status(404).json({ message: "Security not found" });
    }

    res.json(security);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE SECURITY =================
const updateSecurity = async (req, res) => {
  try {
    const security = await Security.findById(req.params.id);

    if (!security) {
      return res.status(404).json({ message: "Security not found" });
    }

    security.name = req.body.name || security.name;
    security.email = req.body.email || security.email;
    security.mobile = req.body.mobile || security.mobile;
    security.shift = req.body.shift || security.shift;

    if (req.body.faceDescriptor) {
      const parsedDescriptor = JSON.parse(req.body.faceDescriptor);

      if (!Array.isArray(parsedDescriptor) || parsedDescriptor.length !== 128) {
        return res.status(400).json({ message: "Invalid face descriptor" });
      }

      security.faceDescriptor = parsedDescriptor;
    }

    // ✅ CLOUDINARY IMAGE UPDATE
    if (req.file) {
      security.photo = req.file.path;
    }

    const updatedSecurity = await security.save();
    res.json(updatedSecurity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE SECURITY =================
const deleteSecurity = async (req, res) => {
  try {
    const security = await Security.findById(req.params.id);

    if (!security) {
      return res.status(404).json({ message: "Security not found" });
    }

    // ❌ No fs.unlink needed (Cloudinary handles deletion if configured later)

    await security.deleteOne();

    res.json({ message: "Security deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addSecurity,
  getSecurities,
  getSecurityById,
  getSecurityByEmail,
  updateSecurity,
  deleteSecurity
};