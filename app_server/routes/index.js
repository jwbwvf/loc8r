var express = require('express');
var router = express.Router();

var locationsController = require('../controllers/locations');
var othersController = require('../controllers/others');


//locations
router.get('/', locationsController.locations);
router.get('/location', locationsController.location);
router.get('/location/review/new', locationsController.newReview);

//others
router.get('/about', othersController.about);

module.exports = router;
