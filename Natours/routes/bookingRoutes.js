const express = require('express');
const bookingController = require('../Controllers/bookingController');

const router = express.Router();

router.post('/bookTour', bookingController.createBooking);
module.exports = router;
