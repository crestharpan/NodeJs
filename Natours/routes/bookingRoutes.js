const express = require('express');
const Booking = require('../models/bookingsModel');
const bookingController = require('../Controllers/bookingController');

const router = express.Router();

router.post('/bookTour', bookingController.createBooking);
module.exports = router;
