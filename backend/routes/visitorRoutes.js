const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  addVisitor,
  getVisitors,
  approveVisitor,
  rejectVisitor,
  exitVisitor,
  findVisitorByEmail,
  getVisitorsForResident
} = require("../controllers/visitorController");

// MULTER
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/visitors");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


// ROUTES
router.post("/", upload.single("photo"), addVisitor);

router.get("/", getVisitors);

router.get("/email/:email", findVisitorByEmail);

// Resident approval
router.put("/approve/:id", approveVisitor);

// GET visitors for a specific resident
router.get("/resident/:email", getVisitorsForResident);

router.put("/reject/:id", rejectVisitor);

// exit
router.put("/exit/:id", exitVisitor);

module.exports = router;