var express = require('express');
var router = express.Router();

//var locationsController = require('../controllers/locations');
var othersController = require('../controllers/others');


//locations
router.get('/', othersController.angularApp);
//router.get('/location/:locationId', locationsController.location);
//router.get('/location/:locationId/review/new', locationsController.newReview);
//router.post('/location/:locationId/review/new', locationsController.createNewReview);

//others
//router.get('/about', othersController.about);

module.exports = router;
