const Notice = require('../models/Notice');

/* ================= ADD NOTICE ================= */
exports.addNotice = async (req, res) => {
  try {

    const { title, description, date, type } = req.body;

    if (!title || !description || !date || !type) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const notice = new Notice({
      title,
      description,
      date,
      type
    });

    await notice.save();

    res.status(201).json({
      message: "Notice added successfully",
      data: notice
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

/* ================= GET ALL NOTICES ================= */
exports.getAllNotices = async (req, res) => {
  try {

    const notices = await Notice.find()
      .sort({ createdAt: -1 });

    res.json({
      data: notices
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

/* ================= GET SINGLE NOTICE ================= */
exports.getNoticeById = async (req, res) => {
  try {

    const { id } = req.params;

    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found"
      });
    }

    res.json({
      data: notice
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

/* ================= UPDATE NOTICE ================= */
exports.updateNotice = async (req, res) => {
  try {

    const { id } = req.params;
    const { title, description, date, type } = req.body;

    if (!title || !description || !date || !type) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { title, description, date, type },
      { new: true }
    );

    if (!updatedNotice) {
      return res.status(404).json({
        message: "Notice not found"
      });
    }

    res.json({
      message: "Notice updated successfully",
      data: updatedNotice
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};

/* ================= DELETE NOTICE ================= */
exports.deleteNotice = async (req, res) => {
  try {

    const { id } = req.params;

    const deleted = await Notice.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        message: "Notice not found"
      });
    }

    res.json({
      message: "Notice deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    });
  }
};