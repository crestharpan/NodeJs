const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

//1)creating a middelware
app.use(morgan('dev')); //it will return the req
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the MIddleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); //manipulating the req
  next();
});

//reading the data from dev-data
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/users.json`)
);
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2) ROUTE HANDLERS
const getTours = (req, res) => {
  res.status(200).json({
    //sending with jsend
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};
const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  // if (id > tours.length - 1) {
  const tour = tours.find((el) => el.id === id);
  if (!tour) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invalid Tour ID',
    });
  } else {
    res.status(200).json({
      //sending with jsend
      status: 'Success',
      data: {
        tour,
      },
    });
  }
};
const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: 'successful',
        data: newTour,
      });
    }
  );
};
const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length - 1) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invalid Tour ID',
    });
  } else {
    res.status(200).json({
      status: 'successful',
      data: '<UPDATED>',
    });
  }
};
const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length - 1) {
    res.status(404).json({
      status: 'Fail',
      message: 'Invalid Tour ID',
    });
  } else {
    res.status(204).json({
      status: 'successful',
      data: null, //to show that the data no longer exist
    });
  }
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'successful',
    data: {
      users,
    },
  });
};
const getUser = (req, res) => {
  const id = req.params.id;
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined',
  });
};

//3) ROUTES
//chaining the methods for the same route
const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route('/').get(getTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

app.use('/api/V1/tours', tourRouter);
app.use('/api/V1/users', userRouter);

//4) START SERVERS
const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
