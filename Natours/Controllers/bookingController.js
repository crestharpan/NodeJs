const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const Booking = require('../models/bookingsModel');
const Tour = require('../models/tourModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const CryptoJS = require('crypto-js');

dotenv.config({ path: './config.env' });

// exports.createBooking = catchAsync(async (req, res) => {
//   await Booking.create(req.body);
//   res.status(200).json({
//     status: 'success',
//     message: 'Booked',
//   });
// });
exports.createBooking = factory.createOne(Booking);

// exports.bookTour = catchAsync(async (req, res, next) => {
//   //1) FIND THE TOUR OF THE ID
//   const tour = await Tour.findOne({ _id: req.params.id });

//   if (!tour) return next(new AppError('Something went Wrong', 400));

//   //2) GENERATE A HASH
//   const uid = uuidv4();
//   const message = `total_amount=${tour.price},transaction_uuid=${uid},product_code=EPAYTEST`;
//   const hash = CryptoJS.HmacSHA256(message, process.env.ESEWA_SECRET);
//   const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

//   //3) RENDER THE PAYMENT GATEWAY PAGE
//   res.status(200).render('book', {
//     description: tour.description,
//     image: tour.imageCover,
//     id: tour.id,
//     title: tour.name,
//     uid: uid,
//     price: tour.price,
//     signature: hashInBase64,
//   });
// });

exports.getAll = factory.getAll(Booking);
exports.getOne = factory.getOne(Booking);
exports.updateOne = factory.updateOne(Booking);
exports.deleteOne = factory.deleteOne(Booking);
