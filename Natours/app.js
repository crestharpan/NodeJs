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

//route
//reading the tour data from dev-data
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
//3) ROUTES
//chaining the methods for the same route
app.route('/api/V1/tours').get(getTours).post(createTour);
app
  .route('/api/V1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//4) START SERVERS
const port = 8000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
