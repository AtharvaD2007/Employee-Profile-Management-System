require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Employee = require("./models/Employee");

const createHR = async () => {
  await connectDB();

  const exists = await Employee.findOne({ email: "hr@gmail.com" });

  if (exists) {
    console.log("HR already exists");
    process.exit();
  }

  await Employee.create({
    name: "HR Admin",
    email: "hr@gmail.com",
    password: await bcrypt.hash("123456", 10),
    department: "Human Resources",
    designation: "HR Manager",
    role: "HR",
    active: true
  });

  console.log("HR account created");
  process.exit();
};

createHR();