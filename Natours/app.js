const express = require('express');
const path = require('path');

const app = express();
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSantitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser'); //PARSE COOKIE FROM THE INCOMING REQUEST
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controllers/errorController');
//importing the routes module
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serving static files
app.use(express.static(path.join(__dirname, '/public')));
//GLOBAL MIDDLEWARE
app.use(helmet()); //SET SECURITY HTTP HEADERS
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       connectSrc: [
//         "'self'",
//         'http://127.0.0.1:8080',
//         'https://cdnjs.cloudflare.com',
//       ],
//       scriptSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
//       styleSrc: ["'self'", 'https://fonts.googleapis.com'],
//       fontSrc: ["'self'", 'https://fonts.gstatic.com'],
//     },
//   }),
// );

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
app.use(express.urlencoded({ extended: true, limit: '10KB' }));
app.use(cookieParser());

//DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSantitize());

//DATA SANTIZATION AGAINST CROSS-SITE ATTACK
app.use(xss());

//PREVENT PARAMETER POLLUTION(HPP)
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //manipulating the req
  next();
});

// ROUTES
app.use('/api/V1/tours', tourRouter);
app.use('/api/V1/users', userRouter);
app.use('/api/V1/reviews', reviewRouter);
app.use('/api/V1/booking', bookingRouter);
//INCLUDING THE VIEWS
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  //CREATING THE APP-ERROR OBJECT AND PASSING THE ARGS
  next(new AppError(`can't find the path ${req.originalUrl}`, 400));
});

app.use(globalErrorHandler);

module.exports = app;
