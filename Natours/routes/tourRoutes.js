const express = require('express');

//importing the routeHandler from Controllers
const tourController = require('../Controllers/tourController');
const authController = require('../Controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

//router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTO('user'),
//     reviewController.createReview,
//   )
//   .get(authController.protect, reviewController.getReviews);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap-tours')
  .get(tourController.aliasRoute, tourController.getTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/')
  .get(tourController.getTours) //ONLY LOGGED IN USERS GET ALL TOURS ACCESS
  .post(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'),
    tourController.createTour,
  );
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTO('admin', 'lead-guide'), //ONLY GIVING ACCESS TO ADMIN AND LEAD-GUIDE TO DELETE THE TOUR
    tourController.deleteTour,
  );

//
module.exports = router;
