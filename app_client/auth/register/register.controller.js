(function () {
	angular
		.module('loc8rApp')
		.controller('registerController', registerController);

	registerController.$inject = ['$location', 'authentication'];
	function registerController($location, authentication) {
		var vm = this;

		vm.pageHeader = {
			title : "Create a new Loc8r account"
		};

		vm.credentials = {
			name : "",
			email : "",
			password : ""
		};

		vm.returnPage = $location.search().page || '/';//Get page to return from query string

		vm.onSubmit = function () {
			vm.formError = "";

			if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
				vm.formError = "All fields required, please try again";
				return false;
			}

			vm.doRegister();
		};

		vm.doRegister = function () {
			vm.formError = "";

			authentication.register(vm.credentials)
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