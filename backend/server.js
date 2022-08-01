const app = require("./app");
// const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const cloudinary = require("cloudinary");

// Handle Uncaught Exceptions
process.on("uncaughtException", (error) => {
  console.log(`ERROR: ${error.message}`);
  console.log("Shutting down server due to Uncaught Exceptions");
  server.close(() => {
    process.exit(1);
  });
});

// Setting up config file
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

// Connecting to database
connectDatabase();

// Set up Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server running on PORT ${process.env.PORT} on ${process.env.NODE_ENV} mode.`
  );
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (error) => {
  console.log(`ERROR: ${error.stack}`);
  console.log("Shutting down server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
