(function () {

	angular
		.module('loc8rApp')
		.filter('formatDistance', formatDistance);

	var _isNumeric = function (n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	function formatDistance () {
		return function (distance) {
			var formattedDistance;
			var units;

			if (!_isNumeric(distance)) {
				console.log("distance: " + distance);
				return "?";
			}

			if (distance > 1) {
				//formattedDistance = parseFloat(distance).toFixed(1);
				formattedDistance = parseFloat(distance / 1000).toFixed(1);
				unit = 'km';
			} else {
				//formattedDistance = parseInt(distance * 1000,10);
				formattedDistance = parseInt(distance,10);
				unit = 'm';
			}

			return formattedDistance + unit;
		}
	};
})();