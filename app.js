//jshint esversion:11
const express = require('express');
const morgan = require('morgan');
const app = express();

//Global Middlewares
app.use(morgan("dev"));
app.use(express.json()); // Middleware to parse the request body

//Routes


//Start Server
app.listen(3000, () => {
    console.log("App started on port 3000");
});