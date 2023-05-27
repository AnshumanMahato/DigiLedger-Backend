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
