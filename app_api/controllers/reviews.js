var mongoose = require('mongoose');
var location = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.json(content);
}

var updateAverageRating = function (locationId, updateAverageRatingCallback) {
	location.findById(locationId).select('rating reviews').exec( function (err, location) {
		if (err) {
			console.log(err);
			return;
		}	

		if (!location.reviews || location.reviews.length <= 0) {
			console.log("no reviews, can't update the average rating");
			return;
		}
		
		var reviewCount = location.reviews.length;
		var ratingTotal = 0;
		for (var i = 0; i < reviewCount; i++) {
			ratingTotal+= location.reviews[i].rating;
		}

		location.rating = parseInt(ratingTotal/reviewCount, 10);

		location.save( updateAverageRatingCallback );//function (err, location) {
			// if (err) {
			// 	console.log(err);
			// } else {
			// 	console.log("Average rating updated to", location.rating);
			// }
		//});
	});
}

var doAddReview = function (req, res, location) {
	if (!location) {
		sendJsonResponse(res, 404, {"message" : "LocationId not found"});
		return;
	}

	location.reviews.push({
		author: req.body.author,
		rating: req.body.rating,
		reviewText: req.body.reviewText
	});

	var currentRating = location.rating;
	var updateAverageRatingCallback = function (err, location) {
		var review = location.reviews[location.reviews.length - 1];
		var response = { review : review };

		if (err) {
			console.log(err);			
			response.rating = currentRating;			
			sendJsonResponse(res, 201, response);			
		} else {
			console.log("Average rating updated to", location.rating);
			response.rating = location.rating;
			sendJsonResponse(res, 201, response);
		}		
	};
	location.save(function (err, location) {
		if (err) {
			console.log(err);
			sendJsonResponse(res, 400, err);
		} else {
			console.log("location._id: " + location._id);			
			updateAverageRating(location._id, updateAverageRatingCallback);
		}
	});
}

module.exports.reviewsCreate = function (req, res) {
	var locationId = req.params.locationId;
	if (!locationId) {
		sendJsonResponse(res, 404, {"message" : "Not found, locationId required"});
		return;
	}

	location.findById(locationId).select('rating reviews').exec( function (err, location) {
		if (err) {
			sendJsonResponse(res, 400, err);			
		} else {
			doAddReview(req, res, location);
		}
	});
}

module.exports.reviewsReadOne = function (req, res) {
	if (!req.params || !req.params.locationId || !req.params.reviewId) {
		sendJsonResponse(res, 404, {"message" : "LocationId and reviewId are both required"});	
		return;
	}

	location.findById(req.params.locationId).select('name reviews').exec(function (err, location) {		
		if (!location) {
			sendJsonResponse(res, 404, {"message" : "LocationId not found"});
			return;
		} 
		
		if (err) {
			sendJsonResponse(res, 404, err);
			return;
		}

		if (!location.reviews || location.reviews.length <= 0) {
			if (!location.reviews) {console.log("location.reviews is null");}
			console.log("review count: " + location.reviews.length);
			sendJsonResponse(res, 404, {"message" : "No reviews found"});
			return;
		}
		console.log(location.reviews);		
		var review = location.reviews.id(req.params.reviewId);
		if (!review) {
			sendJsonResponse(res, 404, {"message" : "ReviewId not found"});
			return;
		}
		
		var response = { 
			location : {
				name : location.name,
				id : req.params.locationId
			},
			review : review
		}
		sendJsonResponse(res, 200, response);		
	});
}

module.exports.reviewsUpdateOne = function (req, res) {
	if (!req.params.locationId || !req.params.reviewId) {
		sendJsonResponse(res, 404, {"message" : "LocationId and reviewId are both required"});
		return;
	}

	location.findById(req.params.locationId).select('reviews').exec(function (err, location) {
		if (!location) {
			sendJsonResponse(res, 404, {"message" : "LocationId not found"});
			return;
		}

		if (err) {
			sendJsonResponse(res, 400, err);
			return;
		}

		if (!location.reviews || location.reviews.length <= 0) {
			sendJsonResponse(res, 404, {"message" : "ReviewId not found"});
			return;
		}

		var review = location.reviews.id(req.params.reviewId);
		if (!review) {
			sendJsonResponse(res, 404, {"message" : "Review not found"});
			return;
		}

		review.author = req.body.author;
		review.rating = req.body.rating;
		review.reviewText = req.body.reviewText;

		location.save(function (err, location) {
			if (err) {
				sendJsonResponse(res, 400, err);
			} else {
				updateAverageRating(location._id);
				sendJsonResponse(res, 200, review);
			}
		});

	});
}

module.exports.reviewsDeleteOne = function (req, res) {
	if (!req.params.locationId || !req.params.reviewId) {
		sendJsonResponse(res, 404, {"message" : "LocationId and reviewId are both required"});
		return;
	}

	location.findById(req.params.locationId).exec(function (err, location) {
		if (!location) {
			sendJsonResponse(res, 404, {"message" : "LocationId not found"});
			return;
		}

		if (err) {
			sendJsonResponse(res, 400, err);
			return;
		}

		if (!location.reviews || location.reviews.length <= 0) {
			sendJsonResponse(res, 404, {"message" : "ReviewId not found"});
			return;
		}

		if (!location.reviews.id(req.params.reviewId)) {
			sendJsonResponse(res, 404, {"message" : "Review not found"});
			return;	
		}

		location.reviews.id(req.params.reviewId).remove();
		location.save(function (err) {
			if (err) {
				sendJsonResponse(res, 400, err);
			} else {
				updateAverageRating(location._id);
				sendJsonResponse(res, 204, null);
			}
		});
	});
}