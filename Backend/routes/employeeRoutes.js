const express = require("express");
const bcrypt = require("bcryptjs");

const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const hrOnly = require("../middleware/role");
const upload = require("../middleware/upload");

const router = express.Router();


router.post("/", auth, hrOnly, upload.single("photo"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      department,
      designation,
      role
    } = req.body;

    if (!name || !email || !password || !department || !designation) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const exists = await Employee.findOne({ email });

    if (exists) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const employee = await Employee.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      department,
      designation,
      role: role === "HR" ? "HR" : "EMPLOYEE",
      photoPath: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", auth, hrOnly, async (req, res) => {
  try {
    const employees = await Employee.find().select("-password");
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "HR" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "You can only view your own profile" });
    }

    const employee = await Employee.findById(req.params.id).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", auth, upload.single("photo"), async (req, res) => {
  try {
    const isHR = req.user.role === "HR";
    const isOwner = req.user.id === req.params.id;

    if (!isHR && !isOwner) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    
    if (!isHR) {
      const allowed = ["name", "department", "designation"];

      Object.keys(req.body).forEach((key) => {
        if (allowed.includes(key)) {
          employee[key] = req.body[key];
        }
      });
    } else {
      const allowed = [
        "name",
        "email",
        "department",
        "designation",
        "role",
        "active"
      ];

      Object.keys(req.body).forEach((key) => {
        if (allowed.includes(key)) {
          employee[key] = req.body[key];
        }
      });

      if (req.body.password) {
        employee.password = await bcrypt.hash(req.body.password, 10);
      }
    }

    if (req.file) {
      employee.photoPath = `/uploads/${req.file.filename}`;
    }

    await employee.save();

    res.json({
      message: "Profile updated successfully",
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.patch("/:id/deactivate", auth, hrOnly, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    ).select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({
      message: "Employee deactivated successfully",
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;