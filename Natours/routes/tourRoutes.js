const express = require('express');

//importing the routeHandler from Controllers
const tourController = require('../Controllers/tourController');

const authController = require('../Controllers/authController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap-tours')
  .get(tourController.aliasRoute, tourController.getTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getTours) //ONLY LOGGED IN USERS GET ALL TOURS ACCESS
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
