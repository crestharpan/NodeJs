const express = require('express');

const app = express();

const morgan = require('morgan');

const server = require('./server');

//importing the routes module
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //it will return the req
}

app.use(express.json());
app.use(express.static(`${__dirname}/public/overview.html`)); //serving static files

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //manipulating the req
  next();
});

// ROUTES
app.use('/api/V1/tours', tourRouter);
app.use('/api/V1/users', userRouter);

module.exports = app;
