const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpire } = require('../config');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) =>
  jwt.sign({ id }, jwtSecret, {
    expiresIn: jwtExpire,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1. Check if email and password not null
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  //2. Check if user exist
  const user = await User.findOne({ email }).select('+password');

  //3. Check if password match
  const correct = await user?.checkPassword(password, user.password);

  if (!user || !correct) {
    throw new AppError('Incorrect email or password', 401);
  }

  //4. Sign token
  const token = signToken(user._id);
  //5. send response
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //check for jwt
  const { authorization } = req.headers;
  let token;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Please login to access this route', 401);
  }

  //veryfiy jwt
  const decoded = await promisify(jwt.verify)(token, jwtSecret);

  //if valid, check user exist
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError('User does not exist', 401);
  }

  //check for password change after jwt issue
  if (user.isPasswordChangedAfter(decoded.iat)) {
    throw new AppError(
      'Password has been changed recently. Please login again!',
      401
    );
  }

  //Grant Access
  req.user = user;
  next();
});

/*
restrictTo takes the roles and then returns a middleware that will check for those roles.
So, while mounting we need to call this with the roles, unlike other middlewares where we
just pass the function.
*/
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('User not authorized to access this route.', 403);
    }
  };
