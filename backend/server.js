const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database');

// Handle Uncaught Exceptions
process.on('uncaughtException', error => {
  console.log(`ERROR: ${error.message}`);
  console.log('Shutting down server due to Uncaught Exceptions');
  server.close(() => {
    process.exit(1);
  })
})

// Setting up config file
dotenv.config({ path: 'backend/config/config.env' })

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT ${process.env.PORT} on ${process.env.NODE_ENV} mode.`);
})

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', error => {
  console.log(`ERROR: ${error.stack}`);
  console.log('Shutting down server due to Unhandled Promise Rejection');
  server.close(() => {
    process.exit(1);
  })
})