const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Router = require("./routers/employeeRoutes");
const Users = require("./models/registerSchema");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// MongoDB connection URL
const dbUrl =
  "mongodb+srv://KomarajuBablu:Honeybablu1772@cluster0.zktypoh.mongodb.net/Roone?retryWrites=true&w=majority";

// Connecting to MongoDB

const connectToDatabase = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectToDatabase();

//Register User Api

app.post("/register", async (request, response) => {
  const { name, username, password, gender } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log(hashedPassword);
  const registerUser = {
    name: name,
    username: username,
    password: hashedPassword,
    gender: gender,
  };
  // console.log(registerUser);
  try {
    const checkUsername = await Users.find({ username: username });
    console.log(checkUsername);
    if (checkUsername.length === 0) {
      response.send(`User Registered Successfully With Username: ${username}`);
      const newUser = new Users(registerUser);
      newUser.save();
    } else {
      response.send("Username Already Exists");
    }
  } catch (error) {
    response.status(500);
    response.send("Unable To Process");
  }
});

//User Login Api

app.post("/login", async (request, response) => {
  const { username, password } = request.body;
  try {
    const checkUsername = await Users.find({ username: username });
    // console.log(checkUsername);
    // console.log(checkUsername[0].password);
    // response.send("login Successful");
    if (checkUsername.length !== 0) {
      const verifyPassword = await bcrypt.compare(
        password,
        checkUsername[0].password
      );
      // console.log(verifyPassword);
      if (verifyPassword) {
        const playLoad = {
          username: username,
        };
        const jwtToken = jwt.sign(playLoad, "AccessToken");
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid Password");
      }
    } else {
      response.status(400);
      response.send("Username Doesn't Exists");
    }
  } catch (error) {
    response.status(500);
    response.send("Unable To Process");
  }
});

app.use("/employee", Router);

app.listen(3005, () => {
  console.log("Server Started");
});
