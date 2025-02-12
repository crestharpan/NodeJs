const { promisify } = require('util');

const jwt = require('jsonwebtoken');

const AppError = require('../utils/appError');

const User = require('../models/usersModel');

const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });
  const token = signToken(newUser._id);
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
  const user = await User.findOne({ email }).select('+password'); //user is a document now and has access to instance method
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  //3) IF EVERYTHING IS RIGHT, SEND THE JWT TOKEN TO THE CLIENT
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting the token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return next(new AppError('You are not logged in', 401));

  //2) Verifying the Token

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //Verify is async function

  //3)Check if user still exists
  const currentUser = await User.findOne({ _id: decoded.id });
  if (!currentUser) return next(new AppError('The user does not exist', 401));

  //4)check if the user changed the password after the token aws issued.
  if (currentUser.changedPasswordAfter(decoded.iat) === true)
    return next(new AppError('Password Changed', 401));

  //GRANT ACCESS
  req.user = currentUser; //USING MIDDLEARE TO MANIPULATE THE REQUEST
  next();
});

//RESTICATING THE OPERATION TO USER OF CERTAIN ROLE

exports.restrictTO = (...roles) => {
  return (req, res, next) => {
    //ROLES IS AN ARRAY OF[ADMIN,LEAD-GUIDE]
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Cannot perform the action', 403));
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //GET THE USER OF THE INPUT EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('user with this email does not exist.', 404));
  }

  //2) SEND THE RESETTOKEN TO THE USER
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
  });
});
exports.resetPassword = catchAsync(async (req, res, next) => {});
