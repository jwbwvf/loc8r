(function () {
	angular
		.module('loc8rApp')
		.service('loc8rData', loc8rData);

	//In order to use minify, we must inject the name of the dependencies into controller and service functions
	//as parameters.  During minify these names get minified into single letters.  This is an issue because 
	//these aren't mere parameters to be used in the context of a function.  The parameters are also references 
	//to the names of other parts of the application, such as services.
	//Injecting as strings is done because minify won't changes the strings.
	//Angular provides the $inject method against the constructors for controllers and services.
	//The $inject method accepts an array of strings.  These strings are the dependencies for a paticular controller
	//or service and match those being passed through as parameters.
	loc8rData.$inject = ['$http', 'authentication'];
	function loc8rData($http, authentication) {

		var locationByCoords = function (lat, lng) {
			return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
		};

		var locationById = function (locationId) {
			return $http.get('/api/locations/' + locationId);
		};

		var addReviewById = function (locationId, data) {
			return $http.post('/api/locations/' + locationId + '/reviews', data, {
				headers : {
					Authorization : 'Bearer ' + authentication.getToken()
				}
			});
		};

		return {
			locationByCoords : locationByCoords,
			locationById : locationById,
			addReviewById : addReviewById
		};
	};
})();