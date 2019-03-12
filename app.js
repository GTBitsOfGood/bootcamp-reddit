const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const routes = require("./routes");

// Load Env Variables
require("dotenv").config();

const app = express();

// initiate DB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
  })
  .then(_ => console.log("Successfully Connected to MongoDB"))
  .catch(err => console.log("Error connecting to MongoDB", err));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
module.exports = app;
