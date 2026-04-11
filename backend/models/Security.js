const mongoose = require("mongoose");

const securitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    shift: { type: String, required: true },
    photo: { type: String, required: true },
    faceDescriptor: { type: [Number], required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Security", securitySchema);
