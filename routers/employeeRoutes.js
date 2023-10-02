const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Employees = require("../models/schema");
const Redis = require("ioredis");
const redisClient = new Redis();
// const DEFAULT_EXPIRATION = 3600;

const verifyAccessToken = (request, response, next) => {
  let jwtToken = null;
  const header = request.headers["authorization"];
  if (header !== undefined) {
    jwtToken = header.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid Access Token");
  } else {
    jwt.verify(jwtToken, "AccessToken", async (error, playLoad) => {
      if (error) {
        response.status(401);
        response.send("Invalid Access Token");
      } else {
        next();
      }
    });
  }
};

router.post("/addemployee", verifyAccessToken, async (request, response) => {
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

// Get all Employees Api

// router.get("/", verifyAccessToken, async (request, response) => {
//   try {
//     const allEmployeesDetails = await Employees.find();
//     response.status(200);

//     response.json({ allEmployeesDetails });
//   } catch (error) {
//     response.status(500);
//     // response.send("Failed to Get Employees Details");
//     console.log("Error: ", error.message);
//   }
// });

router.get("/", verifyAccessToken, async (request, response) => {
  try {
    // Check if the data is already cached in Redis
    const cachedData = await redisClient.get("EmployeesDetails");

    if (cachedData) {
      console.log("Cache hit");
      const parsedData = JSON.parse(cachedData);
      return response.json(parsedData);
    } else {
      // If data is not in cache, fetch it from the database
      const allEmployeesDetails = await Employees.find();

      // Store the fetched data in Redis with an expiration time (e.g., 1 hour)
      await redisClient.set(
        "EmployeesDetails",
        JSON.stringify(allEmployeesDetails),
        "EX",
        3600
      );

      response.status(200);
      response.json({ allEmployeesDetails });
    }
  } catch (error) {
    response.status(500);
    console.log(error);
  }
});

//Get Employee By ID Api

router.get("/:id", verifyAccessToken, async (request, response) => {
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

router.put("/:id", verifyAccessToken, async (request, response) => {
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

router.delete("/:id", verifyAccessToken, async (request, response) => {
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
