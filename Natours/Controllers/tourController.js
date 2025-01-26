const fs = require('fs');

//reading the data from dev-data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`The id is :${val}`);

  if (val81 > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid Tour ID',
    });
  }
  next();
};

// ROUTE HANDLERS
exports.getTours = (req, res) => {
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
exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === parseInt(id));
  res.status(200).json({
    //sending with jsend
    status: 'Success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
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
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'successful',
    data: '<UPDATED>',
  });
};
exports.deleteTour = (req, res) => {
  (204).json({
    status: 'successful',
    data: null, //to show that the data no longer exist
  });
};
