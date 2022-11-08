//jshint esversion:11
const express = require('express');
const morgan = require('morgan');
const booksRouter = require('./routes/bookRoutes');
const entryRouter = require('./routes/entryRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

//Global Middlewares
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.json()); // Middleware to parse the request body
app.use(express.static(`${__dirname}/public`));

//Routes
app.use('/api/v1/books', booksRouter);
app.use('/api/v1/entries', entryRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
