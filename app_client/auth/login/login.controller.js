(function () {
	angular
		.module('loc8rApp')
		.controller('loginController', loginController);

	loginController.$inject = ['$location', 'authentication'];
	function loginController($location, authentication) {
		var vm = this;

		vm.pageHeader = {
			title : "Sign in to Loc8r"
		};

		vm.credentials = {
			email : "",
			password : ""
		};

		vm.returnPage = $location.search().page || '/';//Get page to return from query string

		vm.onSubmit = function () {
			vm.formError = "";

			if (!vm.credentials.email || !vm.credentials.password) {
				vm.formError = "All fields required, please try again";
				return false;
			}

			vm.doLogin();
		};

		vm.doLogin = function () {
			vm.formError = "";

			authentication.login(vm.credentials)
				.error(function (err) {
					vm.formError = err;
				})
				.then(function () {
					$location.search('page', null);//successful so clear query string
					$location.path(vm.returnPage);//successful so redirect user
				});
		};
	};
})();