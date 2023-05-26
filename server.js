const mongoose = require('mongoose');
const { port, database } = require('./config');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, `Uncaught Exception. Shutting Down`);
  process.exit(1);
});

const app = require('./app');

mongoose.connect(database).then(() => {
  console.log('DB Connected');
});

const server = app.listen(port, () => console.log(`listening to port ${port}`));

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message, `Unhandled Rejection. Shutting Down`);
  server.listen(() => {
    process.exit(1);
  });
});
