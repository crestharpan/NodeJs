const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

const User = require('../models/usersModel');

const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: 'Successfully Created',
    token,
    data: {
      User: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //DESTRUCTURING THE OBJECT
  const { email, password } = req.body;
  //1) CHECK IF THE EMAIL AND PASSWORD EXIST
  if (!email || !password) {
    return next(new AppError('Please provide the email or password', 400));
  }

  //2) CHECK IF USER EXIST && PASSWORD IS CORRECT
  const user = User.findOne({ email }).select('+password'); //user is a document now and has access to instance method

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  //3) IF EVERYTHING IS RIGHT, SEND THE JWT TOKEN TO THE CLIENT
  const token = jwt.login({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: 'success',
    token,
  });
});
