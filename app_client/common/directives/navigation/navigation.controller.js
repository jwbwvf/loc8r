(function () {
	angular
		.module('loc8rApp')
		.controller('navigationController', navigationController);

	navigationController.$inject = ['$location', 'authentication']
	function navigationController($location, authentication) {
		var vm = this;

		vm.currentPath = $location.path();

		vm.isLoggedIn = authentication.isLoggedIn();

		vm.currentUser = authentication.currentUser();

		vm.logout = function () {
			authentication.logout();
			$location.path('/');
		};
	};
})();