require('dotenv').config();

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV;
const database =
  env === 'dev' ? process.env.DATABASE_DEV : process.env.DATABASE_PROD;

const config = {
  port,
  env,
  database,
};

module.exports = config;
