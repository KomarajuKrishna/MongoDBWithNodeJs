const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/registerSchema");

//Register User Api

router.post("/register", async (request, response) => {
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

router.post("/login", async (request, response) => {
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

module.exports = router;
