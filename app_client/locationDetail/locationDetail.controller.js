(function () {
	angular
		.module('loc8rApp')
		.controller('locationDetailController', locationDetailController);

	locationDetailController.$inject = ['$routeParams', '$location', '$modal', 'loc8rData', 'authentication'];
	function locationDetailController ($routeParams, $location, $modal, loc8rData, authentication) {
		var vm = this;
		vm.locationId = $routeParams.locationId;
		vm.isLoggedIn = authentication.isLoggedIn();
		vm.currentPath = $location.path();

		loc8rData.locationById(vm.locationId)
			.success(function (data) {
				vm.data = { location : data };
				vm.pageHeader = {
					title : vm.data.location.name	
				};		
			})
			.error(function (e) {
				console.log(e);
			});

		vm.popupReviewForm = function () {
			var modalInstance = $modal.open({
				templateUrl : '/reviewModal/reviewModal.view.html',
				controller : 'reviewModalController as vm',
				resolve : {
					locationData : function () {
						return {
							locationId : vm.locationId,
							locationName : vm.data.location.name
						};
					}
				}
			});

			modalInstance.result.then(function (data) {
				vm.data.location.reviews.push(data.review);
				vm.data.location.rating = data.rating;
			});
		};
	};
})();