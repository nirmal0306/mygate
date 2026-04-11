const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  type: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Notice', noticeSchema);