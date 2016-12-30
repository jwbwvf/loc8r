var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
	author: {type: String, required: true},
	rating: {type: Number, required: true, min: 0, max: 5},
	reviewText: {type: String, required: true},
	createdOn: {type: Date, "default": Date.now}
});

var locationSchema = new mongoose.Schema({
	name: {type: String, required: true},
	address: String,
	rating: {type: Number, "default": 0, min: 0, max: 5},
	facilities: [String],
	coordinates: {type: [Number], index: '2dsphere', required: true},
	hours: [String],
	reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);