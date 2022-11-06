//jshint esversion:11
require('dotenv').config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT;

//Start Server
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
