const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    department: {
      type: String,
      required: true,
      trim: true
    },

    designation: {
      type: String,
      required: true,
      trim: true
    },

    photoPath: {
      type: String,
      default: null
    },

    role: {
      type: String,
      enum: ["HR", "EMPLOYEE"],
      default: "EMPLOYEE"
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);