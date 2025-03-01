const express = require('express');

//importing the routeHandler from Controllers

const authController = require('../Controllers/authController');

const reviewController = require('../Controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getReviews)
  .post(
    authController.protect,
    authController.restrictTO('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );
router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTO('admin', 'user'),
    reviewController.deleteReview,
  )
  .patch(
    authController.restrictTO('admin', 'user'),
    reviewController.updateReview,
  );
module.exports = router;
