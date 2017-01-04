var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJsonResponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.register = function (req, res) {
	if (!req.body.name || !req.body.email || !req.body.password) {
		sendJsonResponse(res, 400, { message : "All fields are required"});
		return;
	};

	var user = new User();

	user.name = req.body.name;
	user.email = req.body.email;


	user.setPassword(req.body.password);

	user.save(function (err) {		
		if (err) {
			sendJsonResponse(res, 404, err);
			return;
		}

		var token = user.generateJwt();
		sendJsonResponse(res, 200, {"token" : token});
	});
};

module.exports.login = function (req, res) {
	if (!req.body.email || !req.body.password) {
		sendJsonResponse(res, 400, { message : "All fields are required"});
		return;
	};

	passport.authenticate('local', function (err, user, info) {		
		if (err) {
			sendJsonResponse(res, 404, err);
			return;
		}

		if (!user) {
			sendJsonResponse(res, 401, info);
			return;
		}

		var token = user.generateJwt();
		sendJsonResponse(res, 200, {"token" : token});


	})(req, res);
};
