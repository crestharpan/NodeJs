const fs = require('fs');
const express = require('express');

//reading the data from dev-data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// ROUTE HANDLERS
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

const router = express.Router();

router.route('/').get(getTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
