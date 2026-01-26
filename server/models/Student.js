const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "On Leave"],
    default: "Active",
  },
  course: {
    type: String,
    required: true,
  },
  enrollmentDate: {
    type: Date,
    required: true,
  },
  profileImage: {
    type: String, // URL or path
    default: "",
  },
  gpa: {
    type: Number,
    min: 0,
    max: 4.0,
    default: 0,
  },
  credits: {
    type: Number,
    default: 0,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Student", studentSchema);
