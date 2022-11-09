//jshint esversion:11
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT;
const { DB } = process.env;

//Connect to Database
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to DB'))
  .catch(() => console.log('Failed to connect to Db'));

//Start Server
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
