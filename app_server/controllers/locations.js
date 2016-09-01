
//GET locations page, home page
module.exports.locations = function (req, res) {
	res.render('locations', { title: 'Locations' });	
};

//GET location page
module.exports.location = function (req, res) {
	res.render('location', { title: 'Location' });	
};

//GET add review page
module.exports.newReview = function (req, res) {
	res.render('newReview', { title: 'New Review' });	
};