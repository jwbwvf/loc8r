var mongoose = require('mongoose');
var location = mongoose.model('Location');

var theEarth = (function () {
	var earthRadius = 6371; //km, miles is 3959

	var getDistanceFromRadians = function (radians) {
		return parseFloat(radians * earthRadius);
	};

	var getRadiansFromDistance = function (distance) {
		return parseFloat(distance / earthRadius);
	};

	return {
		getRadiansFromDistance : getRadiansFromDistance,
		getDistanceFromRadians : getDistanceFromRadians
	};
})();

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.json(content);	
}

module.exports.locationsCreate = function (req, res) {
	location.create({
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(","),
		coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
		hours: req.body.hours.split(",")
	}, function (err, location) {
		if (err) {
			sendJsonResponse(res, 400, err);
		} else {
			sendJsonResponse(res, 201, location);
		}
	});
};

module.exports.locationsListByDistance = function (req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};

	var geoOptions = {
		spherical : true,
		maxDistance : theEarth.getRadiansFromDistance(20),
		num : 10
	};

	if (!lng || !lat) {
		sendJsonResponse(res, 404, {"message" : "lng and lat query parameters are required"});
		return;
	}

	location.geoNear(point, geoOptions, function (err, resutls, stats) {
		if (err) {
			sendJsonResponse(res, 404, err);
			return;
		}

		var locations = [];
		resutls.forEach(function (doc) {
			locations.push({
				distance: theEarth.getDistanceFromRadians(doc.dis),
				name: doc.obj.name,
				address: doc.obj.address,
				rating: doc.obj.rating,
				facilities: doc.obj.facilities,
				_id: doc.obj._id
			});
		});

		sendJsonResponse(res, 200, locations);
	});
}

module.exports.locationsReadOne = function (req, res) {
	if (!req.params || !req.params.locationId) {
		sendJsonResponse(res, 404, {"message" : "No locationId in request"});
		return;
	}
	
	location.findById(req.params.locationId).exec(function (err, location) {
		if (!location) {
			sendJsonResponse(res, 404, {"message" : "LocationId not found"});
			return;
		}

		if (err) {
			sendJsonResponse(res, 404, err);
			return;
		}
		
		sendJsonResponse(res, 200, location);	
	});
}

module.exports.locationsUpdateOne = function (req, res) {
	if (!req.params.locationId) {
		sendJsonResponse(res, 404, {"message" : "Not found, locationId is required"});
		return;
	}

	location.findById(req.params.locationId).select('-reviews -rating').exec(function (err, location) {
		if (!location) {
			console.log("no location found");
			sendJsonResponse(res, 404, {"message" : "LocationId not found"});
			return;
		}

		if (err) {
			console.log("error finding location");
			sendJsonResponse(res, 400, err);
			return;
		}

		location.name = req.body.name;
		location.address = req.body.address;
		location.facilities = req.body.facilities.split(",");
		location.coordinates = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
		location.hours = req.body.hours.split(",");

		location.save(function (err, location) {
			if (err) {
				sendJsonResponse(res, 400, err);
			} else {			
				sendJsonResponse(res, 200, location);
			}
		});
	});
}

module.exports.locationsDeleteOne = function (req, res) {
	if (!req.params.locationId) {
		sendJsonResponse(res, 404, {"message" : "Not found, locationId is required"});
		return;
	}

	location.findByIdAndRemove(req.params.locationId).exec(function (err) {
		if (err) {
			sendJsonResponse(res, 400, err);			
		} else {
			sendJsonResponse(res, 204, null);
		}
	});
}