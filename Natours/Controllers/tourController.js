const Tour = require('../models/tourModel');

// ROUTE HANDLERS
exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      //sending with jsend
      status: 'success',
      requestedAt: req.requestTime,

      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save();
    //alternative
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'successful',
      data: newTour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
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
