const AppError = require('../utils/appError');
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// ROUTE HANDLERS

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

//JUST DEACTIVATING BY USER THEMSELVES
exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(204).json({
    status: 'Success',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Go to signUp please',
  });
};
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
