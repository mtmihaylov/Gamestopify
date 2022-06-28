const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errorMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err, name: err.name };

    error.message = err.message;

    // Wrong Mongoose ObjectID Error
    if (error.name === "CastError") {
      const message = `Resource not found. Invalid ${error.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose Validation Error
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose duplicate key error
    if (error.code === 11000) {
      const message = `Someone's already using that ${Object.keys(
        error.keyValue
      )}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling wrong JWT error
    if (error.name === "JsonWebTokenError") {
      const message = `Invalid JSON web Token. Please try again.`;
      error = new ErrorHandler(message, 400);
    }

    // Handling expired JWT error
    if (error.name === "TokenExpiredError") {
      const message = `Expired JSON web Token. Please try again.`;
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
