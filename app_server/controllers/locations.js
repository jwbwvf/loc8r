var request = require('request');

var apiOptions = {
	server : "http://localhost:3000"
};

if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://" //TODO get production url
};

var _showError = function (req, res, statusCode) {
	var title = statusCode + ", something's gone wrong";
	var content = "Something, somewhere, has gone just a little bit wrong.";

	if (statusCode === 404) {
		title = "404 page not found";
		content = "Looks like we can't find this page.";
	};

	res.status(statusCode);
	res.render('generic-text', {
		title : title,
		content : content
	});
};

var getLocation = function (req, res, callback) {	
	var path = '/api/locations/' + req.params.locationId;
	var options = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};

	request(options, function (err, response, body) {		
		if (response.statusCode === 200) {
			var data = body;				
			data.coordinates = {
				lng : body.coordinates[0],
				lat : body.coordinates[1]
			};
			callback(req, res, data);	
		} else {
			_showError(req, res, response.statusCode);
		}
	});
};

var renderLocations = function (req, res, locations) {
	// var locations = [
	// 	{
	// 		name : 'Starcups',
	// 		rating : 3,
	// 		distance : '100m',
	// 		address : '125 High Street, Reading RG6 1PS',
	// 		facilities : ['Hot drinks', 'Food', 'Premium wifi']
	// 	},
	// 			{
	// 		name : 'Cafe Hero',
	// 		rating : 4,
	// 		distance : '200m',
	// 		address : '125 Low Street, Reading RG9 2PS',
	// 		facilities : ['Hot drinks', 'Food', 'Premium wifi']
	// 	},
	// 			{
	// 		name : 'Burger Queen',
	// 		rating : 2,
	// 		distance : '250m',
	// 		address : '2 Fun Street, RG69 3PS',
	// 		facilities : ['Food', 'Premium wifi']
	// 	}
	// ];
	// var message;

	// if (!(locations instanceof Array)) {
	// 	message = "API lookup error";
	// 	locations = [];
	// } else if (!locations.length) {
	// 	message = "No places found nearby";
	// }

	res.render('locations', {
		title: 'Loc8r - find a place to work with wifi.',
		pageHeader : {
			title : 'Loc8r',
			strapLine : 'Find places to work with wifi near you!' 
		},
//		locations : locations,
//		message: message,
		sidebar : "Looking for wifi and a seat? Loc8r helps you find places"
		 + "to work when you and about.Perhaps with coffee, cake or a pint?"
		 + "Let Loc8r help you find the place you're looking for."
	});
};

var renderLocation = function (req, res, location) {
	// var map = {
	// 	coordinates : {
	// 		lat : location.coords.lat, 
	// 		lng : location.coords.lng
	// 	},
	// 	zoom : 17,
	// 	size : '400x350',
	// 	sensor : false,
	// 	scale : 2
	// }

	// var reviews = [
	// 	{
	// 		rating : 5,
	// 		author : 'Jason Brady',
	// 		date : '31 August 2016',
	// 		comment : "What a great place. I can't say enough good things about it."
	// 	},
	// 	{
	// 		rating : 3,
	// 		author : 'Amanda Brady',
	// 		date : '19 June 2016',
	// 		comment : "It was okay. Coffee wasn't great, but the wifi was fast."
	// 	},
	// ];
	// var location = {
	// 	name : 'Starcups',
	// 	rating : 3,
	// 	distance : '100m',
	// 	address : '125 High Street, Reading RG6 1PS',
	// 	facilities : ['Hot drinks', 'Food', 'Premium wifi'],
	// 	hours : ['Monday - Friday : 7 :00am - 7 :00pm', 'Saturday  : 8 :00am - 5 :00pm', 'Sunday  : closed'],
	// 	reviews : reviews,
	// 	map : map
	// };

	res.render('location', {
		title : location.name,
		pageHeader : {
			title : location.name
		},
		location : location,
		sidebar : {
			context : "Starcups cafe is on Loc8r because it has accessible wifi and space to.sit down with your laptop and get some work done.",
			callToAction : "If you've been and you like it - or if you don't - please leave a review to help other people just like you."
		}
	});
};

var renderRevieForm = function (req, res, location) {
	res.render('newReview', {
		title : 'Review ' + location.name + ' on Loc8r',
		pageHeader : {title : 'Review ' + location.name},
		error: req.query.err,
		url: req.originalUrl
	});
};

//GET locations page, home page
module.exports.locations = function (req, res) {
	// var path = '/api/locations';
	// var options = {
	// 	url : apiOptions.server + path,
	// 	method : "GET",
	// 	json : {},
	// 	qs :  {
	// 		lat : 51.455041, 
	// 		lng : -0.9690884,
	// 		maxDistance : 20
	// 	}
	// };

	// request(options, function (err, response, body) {
//	 	var data = body;
	// 	if (response.statusCode === 200) {
	// 		for (var i = 0; i < data.length; i++) {			
	// 			data[i].distance = _formatDistance(data[i].distance);
	// 		}
	// 	}
		renderLocations(req, res/*, data*/);
//	});
};

//GET location page
module.exports.location = function (req, res) {	
	// var path = '/api/locations/' + req.params.locationId;
	// var options = {
	// 	url : apiOptions.server + path,
	// 	method : "GET",
	// 	json : {}
	// };

	// request(options, function (err, response, body) {		
	// 	if (response.statusCode === 200) {
	// 		var data = body;				
	// 		data.coordinates = {
	// 			lng : body.coordinates[0],
	// 			lat : body.coordinates[1]
	// 		};
	// 		renderLocation(req, res, data);
	// 	} else {
	// 		_showError(req, res, response.statusCode);
	// 	}
	// });
	getLocation(req, res, function (req, res, data) {
		renderLocation(req, res, data);
	});
};

//GET add review page
module.exports.newReview = function (req, res) {
	getLocation(req, res, function (req, res, data) {
		renderRevieForm(req, res, data);
	})	
};

//POST create review
module.exports.createNewReview = function (req, res) {
	var locationId = req.params.locationId;
	var path = "/api/locations/" + locationId + '/reviews';
	
	var data = {
		author : req.body.name,
		rating : parseInt(req.body.rating, 10),
		reviewText : req.body.review
	};
	
	if (!data.author || !data.rating || !reviewText) {
		return res.redirect("/location/" + locationId + "/review/new?err=val");
	}

	var options = {
		url : apiOptions.server + path,
		method : "POST",
		json : data
	};

	request(options, function (err, response, body) {
		if (response.statusCode === 201) {
			res.redirect('/location/' + locationId);
		} else if (response.statusCode === 400 && body.name && body.name === "ValidationError") {
			res.redirect('/location/' + locationId + '/review/new?err=val');			
		} else {
			_showError(req, res, response.statusCode);
		}
	});
};