const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
  block: {
    type: String,
    required: true
  },
  flat: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['owner', 'rental'],
    required: true
  }
});

const residentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    mobile: {
      type: String,
      required: true
    },
    flats: {
      type: [flatSchema],
      required: true
    },
    photo: {
      type: String,
      default: ''
    },
    faceDescriptor: {
      type: [Number],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resident', residentSchema);
