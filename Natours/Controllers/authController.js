const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createNewToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  //REMOVE PASSWORD FROM THE OUTPUT
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
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
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createNewToken(newUser, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  //DESTRUCTURING THE OBJECT
  const { email, password } = req.body;
  //1) CHECK IF THE EMAIL AND PASSWORD EXIST
  console.log(email, password);
  if (!email || !password) {
    return next(new AppError('Please provide the email or password', 400));
  }

  //2) CHECK IF USER EXIST && PASSWORD IS CORRECT
  const user = await User.findOne({ email }).select('+password'); //user is a document now and has access to instance method
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  //3) IF EVERYTHING IS RIGHT, SEND THEjJWT TOKEN TO THE CLIENT
  createNewToken(user, 201, res);
});

//LOGOUT
exports.logout = (req, res) => {
  res.cookie('jwt', 'logged out', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting the token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = currentUser;
  next();
});

//ONLY FOR RENDERED PAGES
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;

      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

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
  //1) GET THE USER OF THE INPUT EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('user with this email does not exist.', 404));
  }
  //2) GENERATE THE TOKEN
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) SEND THE RESETTOKEN TO THE USER
  const resetURL = `${req.protocol}://${req.get('host')}/api/V1/users/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to Email',
    });
  } catch (err) {
    user.PasswordResetToken = undefined;
    user.PasswordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Error while sending Email, Try again Later', 500),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) GET USER BASED ON THE TOKEN
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  //RETURN USER ONLY AFTER MATCHING THE RESET-TOKEN AND IF DATE IS GREATER THAN PRESENT DATE
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) IF TOKEN HAS NOT EXPIRED AND THERE IS USER, SET THE NEW PASSWORD
  if (!user) return next(new AppError('Token is expired or is invalid', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  //4)LOG THE USER IN AND SEND JWT
  createNewToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1)GET USER FROM THE COLLECTION
  const user = await User.findById(req.user.id).select('+password');
  if (!user) return next(new AppError('cannot find the user', 401));

  //2) CHECK IF POSTED CURRENT PASSWORD IS VALID

  if (
    (await user.correctPassword(req.body.passwordCurrent, user.password)) ===
    false
  ) {
    return next(new AppError('Invalid password', 401));
  }

  //3) UPDATE THE PASSWORD
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4)LOG THE USER IN AND SEND JWT
  createNewToken(user, 200, res);
});
