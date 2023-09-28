const mongoose = require("mongoose");

const EmployeesDetailsSchema = mongoose.Schema({
  employee_name: { type: String },
  employee_age: { type: Number },
  role: { type: String },
  gmail: { type: String },
  joining_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Employees", EmployeesDetailsSchema);
