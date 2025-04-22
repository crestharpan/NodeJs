const Booking = require('../models/bookingsModel');
const catchAsync = require('../utils/catchAsync');

exports.createBooking = catchAsync(async (req, res) => {
  await Booking.create(req.body);
  res.status(200).json({
    status: 'success',
    message: 'Booked',
  });
});
