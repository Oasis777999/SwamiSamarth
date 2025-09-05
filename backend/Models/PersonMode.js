const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    // required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: "India",
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    // required: true, // Must have uploaded photo file path
  },
  kycDocument: {
    type: String,
    // required: true, // Must have uploaded KYC file path
  },
});

module.exports = mongoose.model('Person', PersonSchema);