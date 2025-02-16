const fs = require('fs');
const AppError = require('../utils/appError');
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');

//reading the data from dev-data
// const users = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`),
// );

// ROUTE HANDLERS
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'successful',
    data: {
      users,
    },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1) CREATEERROR IF USER POSTS PASSWORD DATA
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(' This route is not for updating password', 400));
  }
  const user = await User.findOne({ _id: req.user.id });
  if (!user) {
    return next(new AppError('User not found', 401));
  }
  const allowedField = ['name', 'email'];
  Object.keys(req.body).forEach((el) => {
    if (allowedField.includes(el)) {
      user[el] = req.body[el];
    }
  });
  await user.save({ validateModifiedOnly: true });
  res.status(200).json({
    status: 'success',
    user,
  });
});

//JUST DEACTIVATING THE USER
exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(500).json({
    status: 'error',
    user,
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
