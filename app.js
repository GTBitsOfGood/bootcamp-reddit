const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const swaggerUiGenerator = require("express-swagger-generator");

// Load Env Variables
require("dotenv").config();

const app = express();
app.use(cors());

// Generate API docs
const expressSwagger = swaggerUiGenerator(app);

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

app.use("/api/v1/", routes);

let options = {
  swaggerDefinition: {
    info: {
      description: "GT Bits of Good - Bootcamp Project",
      title: "Reddit Backend",
      version: "1.0.0"
    },
    basePath: "/api/v1",
    // basePath: "/",
    produces: ["application/json"],
    schemes: ["https", "http"],
    securityDefinitions: {}
  },
  basedir: __dirname, //app absolute path
  files: ["./routes/**/*.js"] //Path to the API handle folder
};
expressSwagger(options);
app.use("/*", (req, res) => res.redirect("/api-docs"));

module.exports = app;
