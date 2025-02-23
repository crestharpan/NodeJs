const express = require('express');

//importing the routeHandler from Controllers
const tourController = require('../Controllers/tourController');

const authController = require('../Controllers/authController');

const reviewController = require('../Controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getReviews)
  .post(authController.protect, reviewController.createReview);

module.exports = router;
