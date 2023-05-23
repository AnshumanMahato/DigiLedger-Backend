const path = require('path');
const express = require('express');
const transactionRouter = require('./routes/transactionRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/transaction', transactionRouter);

module.exports = app;
