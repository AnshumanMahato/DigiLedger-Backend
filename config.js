require('dotenv').config();

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV;
const database =
  env === 'dev' ? process.env.DATABASE_DEV : process.env.DATABASE_PROD;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRE;
const jwtCookieExpire = process.env.JWT_COOKIE_EXPIRE;

const config = {
  port,
  env,
  database,
  jwtSecret,
  jwtExpire,
  jwtCookieExpire,
};

module.exports = config;
