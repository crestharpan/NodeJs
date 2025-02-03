const express = require('express');

//importing the routeHandler from Controllers
const tourController = require('../Controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap-tours')
  .get(tourController.aliasRoute, tourController.getTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/').get(tourController.getTours).post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
