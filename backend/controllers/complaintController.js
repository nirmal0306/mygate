const Complaint = require('../models/Complaint');

/* ================= ADD COMPLAINT ================= */
exports.addComplaint = async (req, res) => {
  try {

    const {
      name,
      email,
      mobile,
      flats,
      subject,
      category,
      description,
      status
    } = req.body;

    if (!name || !email || !subject || !category || !description) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const complaint = new Complaint({
      name,
      email,
      mobile,
      flats,
      subject,
      category,
      description,
      status
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


/* ================= GET ALL COMPLAINTS ================= */
exports.getAllComplaints = async (req, res) => {
  try {

    const complaints = await Complaint.find().sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


/* ================= GET COMPLAINTS BY EMAIL ================= */
exports.getComplaintsByEmail = async (req, res) => {
  try {

    const { email } = req.params;

    const complaints = await Complaint.find({ email }).sort({ createdAt: -1 });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, category } = req.body;

    let responseMessage = "";

    // 🔥 Auto reply based on category
    if (status === "Resolved") {
      switch (category) {
        case "Water Issue":
          responseMessage = "Your water issue has been resolved. A plumber was assigned.";
          break;
        case "Electricity":
          responseMessage = "Your electricity issue has been resolved. Technician has fixed it.";
          break;
        case "Maintenance":
          responseMessage = "Maintenance issue resolved by our team.";
          break;
        case "Security":
          responseMessage = "Security team has addressed your concern.";
          break;
        default:
          responseMessage = "Your complaint has been resolved successfully.";
      }
    }

    const updated = await Complaint.findByIdAndUpdate(
      id,
      { status, responseMessage },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Status updated successfully",
      complaint: updated
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};