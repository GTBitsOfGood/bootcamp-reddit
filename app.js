const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const routes = require("./routes");
const swaggerUiGenerator = require('express-swagger-generator');

// Load Env Variables
require("dotenv").config();

const app = express();

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
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/", routes);

let options = {
    swaggerDefinition: {
        info: {
            description: 'GT Bits of Good - Bootcamp Project',
            title: 'Reddit Backend',
            version: '1.0.0',
        },
        basePath: '/api/v1',
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {}
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/**/*.js'] //Path to the API handle folder
};
expressSwagger(options);

module.exports = app;
