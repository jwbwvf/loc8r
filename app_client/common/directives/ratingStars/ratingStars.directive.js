(function () {
	angular
		.module('loc8rApp')
		.directive('ratingStars', ratingStars);

	function ratingStars () {
		return {
			scope : {
				thisRating : '=rating'
			},
			templateUrl : '/common/directives/ratingStars/ratingStars.template.html'
		};
	};
})();