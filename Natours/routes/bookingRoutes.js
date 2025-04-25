const express = require('express');
const authController = require('../Controllers/authController');
const bookingController = require('../Controllers/bookingController');

const router = express.Router();

router.use(authController.protect);

router.post('/bookTour', bookingController.createBooking);

router.use(authController.restrictTO('admin', 'lead-guide'));

router.get('/getBookings', bookingController.getAll);
router
  .route('/:id')
  .get(bookingController.getOne)
  .patch(bookingController.updateOne)
  .post(bookingController.deleteOne);

module.exports = router;
