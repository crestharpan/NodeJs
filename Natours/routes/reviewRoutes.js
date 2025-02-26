const express = require('express');

//importing the routeHandler from Controllers

const authController = require('../Controllers/authController');

const reviewController = require('../Controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTO('user'),
    reviewController.createReview,
  );
router
  .route('/:id')
  .delete(authController.protect, reviewController.deleteReview);
module.exports = router;
