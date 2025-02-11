const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errorResponse.keyValue.name;

  const message = `Tour with name ${value} already exist`;
  return new AppError(message, 400);
};

const handleValidatonErroDB = (err) => {
  const errors = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');
  const message = `Invalid data: ${errors}`;
  return new AppError(message, 400);
};

const handleJwtToken = () => new AppError('Invalid token', 401);

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const handleJwtExpiredError = () =>
  new AppError('Your token has been expired. Please log in again', 401);
const sendErrPro = (err, res) => {
  //OPERATIONA ERROR: SEND MESSAGE TO THE CLIENT

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //OTHER UNKNOWN PROGRAMMING ERRORS: DON'T GIVE DETAILS ABOUT THE ERROR TO THE CLIENT
  } else {
    //LOG THE ERROR (FOR US TO IDENTIFY THE ERROR)
    // console.error('ERROR:', err);
    //SEND THE GENERIC MESSAGE ERROR TO THE CLIENT

    res.status(500).json({
      status: 'Fail',
      message: 'Something went Wrong',
      errorName: err.name,
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError') error = handleValidatonErroDB();

    if (error.name === 'JsonWebTokenError') error = handleJwtToken();

    if (error.name === 'TokenExpiredError')
      error = handleJwtExpiredError(error);

    sendErrPro(error, res);
  }
};
