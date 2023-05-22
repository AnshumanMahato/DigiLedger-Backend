const path = require('path');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.route('/transaction').get((req, res, next) => {
  res.status(200).json({
    status: 200,
    data: 'hello',
  });
});

module.exports = app;
