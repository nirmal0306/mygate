const express = require('express');
const router = express.Router();
const Leave = require('../models/LeaveApplication'); // ✅ FIX
const leaveController = require('../controllers/leaveController');

router.post('/', leaveController.applyLeave);
router.get('/', leaveController.getAllLeaves);
router.put('/:id', leaveController.updateLeaveStatus);
router.get('/email/:email', async (req, res) => {
  const leaves = await Leave.find({ email: req.params.email }).sort({ createdAt: -1 });
  res.json(leaves);
});

module.exports = router;