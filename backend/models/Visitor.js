const mongoose = require("mongoose");

// ================= VISITOR SCHEMA =================
const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { 
      type: String,
      required: true
    },

    mobile: { type: String, required: true },

    visitorType: { type: String, required: true },

    photo: { type: String },

    block: { type: String, required: true },
    flat: { type: String, required: true },

    residentName: { type: String },
    residentEmail: { type: String }, // ✅ fixed typo

    purpose: { type: String },

    entryTime: { type: Date, default: null },
    exitTime: { type: Date, default: null },

    status: {
      type: String,
      enum: ["Pending","Accepted","Rejected"],
      default: "Pending"
    },

    exitStatus: {
      type: String,
      enum: ["Inside","Exited"],
      default: "Inside"
    },

    addedBy: {
      type: String,
      default: "Security Guard"
    }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
