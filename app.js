const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { env } = require('./config');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');
const transactionRouter = require('./routes/transactionRoutes');

const app = express();

//Middlewares
if (env === 'dev') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/api/v1/transaction', transactionRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
