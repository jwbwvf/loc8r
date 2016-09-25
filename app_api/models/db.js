var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/loc8r';

//to run with production database $NODE_ENV=production nodemon
if (process.env.NODE_ENV === 'production') {
	dbURI = process.env.AWS_MONGO_URI//needs setup with aws db, need to setup a AWS_MONGO_URI environment variable
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
	console.log('Mongoose error ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

//for nodemon restarts
process.once('SIGUSR2', function () {
	gracefulShutdown('nodemon restart', function () {
		process.kill(process.pid, 'SIGUSR2');
	});
});

//for app termination
process.on('SIGINT', function () {
	gracefulShutdown('app termination', function () {
		process.exit(0);
	});
});

require('./locations');