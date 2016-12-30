(function() {
	
	angular.module('loc8rApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

	function config ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl : 'home/home.view.html',
				controller : 'homeController',
				controllerAs : 'vm'
			})
			.when('/about', {
				templateUrl : '/common/views/genericText.view.html',
				controller : 'aboutController',
				controllerAs : 'vm'
			})
			.when('/location/:locationId', {
				templateUrl : '/locationDetail/locationDetail.view.html',
				controller : 'locationDetailController',
				controllerAs : 'vm'
			})
			.otherwise({redirectTo: '/'});

		$locationProvider.html5Mode(true);
	}

	angular
		.module('loc8rApp')
		.config(['$routeProvider', '$locationProvider', config]);
})();