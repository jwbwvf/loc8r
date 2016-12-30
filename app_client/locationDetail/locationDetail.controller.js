(function () {
	angular
		.module('loc8rApp')
		.controller('locationDetailController', locationDetailController);

	locationDetailController.$inject = ['$routeParams', '$modal', 'loc8rData'];
	function locationDetailController ($routeParams, $modal, loc8rData) {
		var vm = this;
		vm.locationId = $routeParams.locationId;

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