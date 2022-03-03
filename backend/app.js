const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/errors');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// Import all routes
const products = require('./routes/product');
const users = require('./routes/user');
const orders = require('./routes/order');

app.use('/api/v1', products);
app.use('/api/v1', users);
app.use('/api/v1', orders);

// Middleware for handling errors
app.use(errorMiddleware);

module.exports = app;