const { v4: uuidv4 } = require('uuid');
const CryptoJS = require('crypto-js');
const Tour = require('../models/tourModel');
const User = require('../models/usersModel');
const Booking = require('../models/bookingsModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) GET THE TOURS FROM THE COLLECTION
  const tours = await Tour.find();
  //2) BUILD THE TEMPLATE
  //3) RENDER THE TEMPLATE USING THE DATA
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) return next(new AppError('No tour with this name', 404));
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com",
    )
    .render('login', {
      title: 'login',
    });
});

exports.getMyTours = catchAsync(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id });
  const toursIds = bookings.map((el) => el.tour._id);
  const tours = await Tour.find({ _id: { $in: toursIds } });
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.userAccount = async (req, res) => {
  res.status(200).render('account', {
    title: 'Profile',
    // user: currUser,
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).render('account', {
    title: 'Profile',
    user: updatedUser,
  });
});

exports.bookTour = catchAsync(async (req, res, next) => {
  //1) FIND THE TOUR OF THE ID
  const tour = await Tour.findOne({ _id: req.params.id });

  if (!tour) return next(new AppError('Something went Wrong', 400));

  //2) GENERATE A HASH
  const uid = uuidv4();
  console.log(uid);
  const message = `total_amount=${tour.price},transaction_uuid=${uid},product_code=EPAYTEST`;
  const hash = CryptoJS.HmacSHA256(message, process.env.ESEWA_SECRET);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  //3) RENDER THE PAYMENT GATEWAY PAGE
  res.status(200).render('book', {
    description: tour.description,
    image: `/img/tours/${tour.imageCover}`,
    id: tour.id,
    title: tour.name,
    uid: uid,
    price: tour.price,
    signature: hashInBase64,
    averageRating: `⭐${tour.ratingsAverage}`,
    quantityRating: tour.ratingsQuantity,
  });
});
