const express = require("express");
const router = express.Router();

const {
  makePayment,
  getAllPayments,
  getUserPayments
} = require("../controllers/paymentController");

router.post("/pay", makePayment);
router.get("/", getAllPayments);
router.get("/:userId", getUserPayments);

module.exports = router;