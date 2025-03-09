const express = require('express');
const viewsController = require('../Controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.allTours);
router.get('/tour', viewsController.tour);

module.exports = router;
