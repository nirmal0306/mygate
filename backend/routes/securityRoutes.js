const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addSecurity,
  getSecurities,
  getSecurityById,
  getSecurityByEmail,
  updateSecurity,
  deleteSecurity
} = require("../controllers/securityController");

// MULTER
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/security");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ROUTES
router.post("/", upload.single("photo"), addSecurity);
router.get("/", getSecurities);
router.get("/profile/:email", getSecurityByEmail);   // ⭐ IMPORTANT
router.get("/:id", getSecurityById);
router.put("/:id", upload.single("photo"), updateSecurity);
router.delete("/:id", deleteSecurity);

module.exports = router;