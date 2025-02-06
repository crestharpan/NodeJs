//INHERITS FROM THE DEFAULT ERROR CLASS
class AppError extends Error {
  constructor(message, statusCode) {
    //Calling the parent constructor
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'Fail' : 'Error';
    //TO SHOW THAT THE ERROR CLASS HANDLES ONLU OPERATIONAL ERRORS
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
