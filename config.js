require('dotenv').config();

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV;
const database =
  env === 'dev'
    ? process.env.DATABASE_DEV
    : process.env.DATABASE_PROD.replace(
        '<password>',
        process.env.DATABASE_PROD_PASS
      );
const jwtSecret = process.env.JWT_SECRET;
const jwtExpire = process.env.JWT_EXPIRE;
const jwtCookieExpire = process.env.JWT_COOKIE_EXPIRE;
const origin = process.env.ORIGIN;

const config = {
  port,
  env,
  database,
  jwtSecret,
  jwtExpire,
  jwtCookieExpire,
  origin,
};

module.exports = config;
