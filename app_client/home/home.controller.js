(function () {

	angular
	 	.module('loc8rApp')
	 	.controller('homeController', homeController);

	homeController.$inject = ['$scope', 'loc8rData', 'geolocation'];
	function homeController ($scope, loc8rData, geolocation) {
		//Behind the scenes, when you use a controller in an applications it's generated using
		//javaScript's new method, creating a single instance.
		//When the controllerAs syntax is used, Angular uses this inside the function,
		//and binds it to $scope.
	 	var vm = this;

	 	vm.pageHeader = {
			title : "loc8r",
			strapLine : "Find places to work with wifi near you!"	
		};

		vm.sidebar = {
			content : "Looking for wifi and a seat? Loc8r helps you find places"
			 + "to work when you and about.Perhaps with coffee, cake or a pint?"
			 + "Let Loc8r help you find the place you're looking for."
		}

		vm.message = "Checking your location";

		vm.getData = function (position) {
			var lat = 51.551041;//position.coords.latitude;
			var lng = -0.9630884;//position.coords.longitude;
			console.log("lat: " + lat);
			console.log("lng: " + lng);

			vm.message = "Searching for nearby places";

			loc8rData.locationByCoords(lat, lng)
				.success(function (data) {
					vm.message = data.length > 0 ? "" : "No locations found";
					vm.data = { locations : data };
				})
				.error(function (e) {
					vm.message = "Sorry, something's gone wrong ";
					console.log(e);
				});		
		}

		//$scope.$apply
		//$apply is a method of $scope, and vm doesn't inherit it and can't access it becuase vm is also a child of $scope.
		//so $scope has to be passed in so that the $apply can be called after asynchronous calls finish
		vm.showError = function (error) {
			$scope.$apply(function () {
				vm.message = error.message;
			})
		};

		vm.noGeo = function () {
			$scope.$apply(function () {
				vm.message = "Geolocation not supported by this browser";
			});
		};

		geolocation.getPosition(vm.getData, vm.showError, vm.noGeo);	
	 }
 })();