const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/errors");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const dotenv = require("dotenv");

// Setting up config file
dotenv.config({ path: "backend/config/config.env" });

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// Import all routes
const products = require("./routes/product");
const users = require("./routes/user");
const orders = require("./routes/order");
const payment = require("./routes/payment");

app.use("/api/v1", products);
app.use("/api/v1", users);
app.use("/api/v1", orders);
app.use("/api/v1", payment);

// Middleware for handling errors
app.use(errorMiddleware);

module.exports = app;
