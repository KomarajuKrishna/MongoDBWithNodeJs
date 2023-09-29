const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Router = require("./routers/employeeRoutes");
const userRouter = require("./routers/userRouters");

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

app.use("/employee", Router);
app.use("/", userRouter);

app.listen(3005, () => {
  console.log("Server Started");
});
