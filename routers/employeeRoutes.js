const express = require("express");
const router = express.Router();
const Employees = require("../models/schema");

router.post("/addemployee", async (request, response) => {
  try {
    const newEmployee = new Employees(request.body);
    await newEmployee.save();
    response.status(201).json({
      Message: "Employee Added Successfully",
    });
  } catch (error) {
    response.status(500);
    response.send("Failed to Add Employee");
    console.log("Error: ", error.message);
  }
});

//Get all Employees Api

router.get("/", async (request, response) => {
  try {
    const allEmployeesDetails = await Employees.find();
    response.status(200);
    response.json({ allEmployeesDetails });
  } catch (error) {
    response.status(500);
    response.send("Failed to Get Employees Details");
    console.log("Error: ", error.message);
  }
});

//Get Employee By ID Api

router.get("/:id", async (request, response) => {
  try {
    const employeeDetails = await Employees.findById(request.params.id);
    if (employeeDetails === null) {
      response.status(400);
      response.send("The ID You Have Provided is Not Found");
    } else {
      response.status(200);
      response.json({ employeeDetails });
    }
  } catch (error) {
    response.status(500);
    response.send("Failed to Get Employees Details");
    console.log("Error: ", error.message);
  }
});

// Update Employee Details

router.put("/:id", async (request, response) => {
  try {
    const updateEmployeeDetails = await Employees.findByIdAndUpdate(
      request.params.id,
      request.body
    );
    console.log(updateEmployeeDetails);
    if (updateEmployeeDetails === null) {
      response.status(400);
      response.send("The ID You Have Provided is Not Found");
    } else {
      response.status(202);
      response.send("Employee Details Updated Successfully");
    }
  } catch (error) {
    response.status(500);
    response.send("Failed to Get Employees Details");
    console.log("Error: ", error.message);
  }
});

//Delete Employee By ID Api

router.delete("/:id", async (request, response) => {
  try {
    const deleteEmployee = await Employees.findByIdAndDelete(request.params.id);
    if (deleteEmployee === null) {
      response.status(400);
      response.send("The ID You Have Provided is Not Found");
    } else {
      response.status(200);
      response.send("Employee Deleted Successfully");
    }
  } catch (error) {
    response.status(500);
    response.send("Failed to Get Employees Details");
    console.log("Error: ", error.message);
  }
});

module.exports = router;
