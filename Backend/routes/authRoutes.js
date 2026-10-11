const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;

    if (!name || !email || !password || !department || !designation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Employee.findOne({ email });

    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await Employee.create({
      name,
      email,
      password: hashedPassword,
      department,
      designation,
      role: "EMPLOYEE"
    });

    res.status(201).json({
      message: "Employee registered successfully",
      employeeId: employee._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });

    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!employee.active) {
      return res.status(403).json({ message: "Employee is inactive" });
    }

    const token = jwt.sign(
      {
        id: employee._id,
        role: employee.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: employee.role,
      employeeId: employee._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;