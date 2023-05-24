const path = require('path');
const express = require('express');
const morgan = require('morgan');
const transactionRouter = require('./routes/transactionRoutes');

const app = express();

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/v1/transaction', transactionRouter);

module.exports = app;
