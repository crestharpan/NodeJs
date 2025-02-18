const express = require('express');
const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
//importing the routes module
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

//GLOBAL MIDDLEWARE
app.use(helmet()); //SET SECURITY HTTP HEADERS

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //it will return the req
}

//LIMIT THE REQUEST FROM THE SAME IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from the same ip, Try again in 1 hour',
});
app.use('/api', limiter); //TO USE LIMITER ON ALL ROUTES FOR /API

//BODY PARSER(READING DATA FROM BODY inTO REQ.BODY)
app.use(express.json({ limit: '10KB' }));

//DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
//DATA SANTIZATION AGAINST CROSS-SITE ATTACK

//serving static files
app.use(express.static(`${__dirname}/public/overview.html`));

//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //manipulating the req
  next();
});

// ROUTES
app.use('/api/V1/tours', tourRouter);
app.use('/api/V1/users', userRouter);

app.all('*', (req, res, next) => {
  //CREATING THE APP-ERROR OBJECT AND PASSING THE ARGS
  next(new AppError(`can't find the path ${req.originalUrl}`, 400));
});

app.use(globalErrorHandler);

module.exports = app;
