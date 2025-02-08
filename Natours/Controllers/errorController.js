const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrPro = (err, res) => {
  //OPERATIONA ERROR: SEND MESSAGE TO THE CLIENT
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //OTHER UNKNOW PROGRAMMING ERRORS: DON'T GIVE DETAILS ABOUT THE ERROR TO THE CLIENT
  } else {
    //LOG THE ERROR (FOR US TO IDENTIFY THE ERROR)
    console.error('ERROR:', err);

    //SEND THE GENERIC MESSAGE ERROR TO THE CLIENT
    res.status(500).json({
      status: 'Fail',
      message: 'Something went Wrong',
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
    sendErrPro(err, res);
  }
};
