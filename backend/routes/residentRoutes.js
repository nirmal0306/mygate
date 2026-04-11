const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  addResident,
  getResidents,
  getResidentById,
  updateResident,
  getResidentByEmail,
  deleteResident
} = require("../controllers/residentController");

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/residents");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "")}`);
  }
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(new Error("Images only"));
    }
    cb(null, true);
  }
});

// ===== ROUTES =====
router.post("/", upload.single("photo"), addResident);
router.get("/", getResidents);
router.get("/profile/:email", getResidentByEmail);
router.get("/:id", getResidentById);
router.put("/:id", upload.single("photo"), updateResident);
router.delete("/:id", deleteResident);

module.exports = router;
