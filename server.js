const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const { port, database, env } = require('./config');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message, `Uncaught Exception. Shutting Down`);
  process.exit(1);
});

const app = require('./app');

mongoose.connect(database).then(() => {
  console.log('DB Connected');
});

let server;

if (env === 'dev') {
  server = https
    .createServer(
      {
        key: fs.readFileSync('./certs/localhost-key.pem'),
        cert: fs.readFileSync('./certs/localhost.pem'),
      },
      app
    )
    .listen(port, () => console.log(`listening to port ${port}`));
} else {
  server = app.listen(port, () => console.log(`listening to port ${port}`));
}

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message, `Unhandled Rejection. Shutting Down`);
  server.listen(() => {
    process.exit(1);
  });
});

//SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
