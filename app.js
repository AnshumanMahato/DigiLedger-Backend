//jshint esversion:11
const express = require('express');
const morgan = require('morgan');
const app = express();

//Global Middlewares
app.use(morgan("dev"));
app.use(express.json()); // Middleware to parse the request body
app.use(express.static(`${__dirname}/public`));

//Routes


module.exports = app;