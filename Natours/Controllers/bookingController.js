const Booking = require('../models/bookingsModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// exports.createBooking = catchAsync(async (req, res) => {
//   await Booking.create(req.body);
//   res.status(200).json({
//     status: 'success',
//     message: 'Booked',
//   });
// });
exports.createBooking = factory.createOne(Booking);
exports.getAll = factory.getAll(Booking);
exports.getOne = factory.getOne(Booking);
exports.updateOne = factory.updateOne(Booking);
exports.deleteOne = factory.deleteOne(Booking);
