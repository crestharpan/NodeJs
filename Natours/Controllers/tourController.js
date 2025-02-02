const Tour = require('../models/tourModel');

exports.aliasRoute = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
};

// ROUTE HANDLERS
exports.getTours = async (req, res) => {
  try {
    //BUILD THE QUERY
    //making a hard copy of req.query objects
    //1A) FILTERING
    const queryObj = { ...req.query };

    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    excludeFields.forEach((element) => {
      delete queryObj[element];
    });

    //1B) ADVANCED FILTERING
    //{ duration: { gte: '5' }, difficulty: 'easy' }
    let querStr = JSON.stringify(queryObj);
    querStr = querStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = Tour.find(JSON.parse(querStr));

    //2) SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //3) FIELD LIMITING FEATURE
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); //Excluding the __v
    }
    //PAGINATION
    //page=2&limit =10{ page1=1-10 and page2=11-20 so skip first 10 pages to retrieve the second page}
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocument();
      if (skip >= numTours) throw new Error('The page does not exist ');
    }

    //EXECUTE THE QUERY
    const tours = await query;
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      request: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failed',
      message: err.message,
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
      message: err.message,
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
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'successful',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.parmas.id);
    req.status(200).json({
      status: 'successful',
      data: null, //to show that the data no longer exist
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err,
    });
  }
};
