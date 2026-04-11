const Leave = require('../models/LeaveApplication');

/* ================= APPLY LEAVE ================= */
exports.applyLeave = async (req, res) => {
  try {
    const { name, email, fromDate, toDate, reason } = req.body;

    if (!name || !email || !fromDate || !toDate || !reason) {
      return res.status(400).json({ message: "All fields required" });
    }

    const leave = new Leave({
      name,
      email,
      fromDate,
      toDate,
      reason
    });

    await leave.save();

    res.status(201).json({ message: "Leave applied", leave });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET ALL ================= */
exports.getAllLeaves = async (req, res) => {
  const leaves = await Leave.find().sort({ createdAt: -1 });
  res.json(leaves);
};


/* ================= UPDATE STATUS ================= */
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responseMessage } = req.body;

    const updated = await Leave.findByIdAndUpdate(
      id,
      {
        status,
        responseMessage // ✅ store admin message
      },
      { new: true }
    );

    res.json({ message: "Updated", leave: updated });

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
};