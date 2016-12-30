(function () {
	angular
		.module('loc8rApp')
		.controller('reviewModalController', reviewModalController);

	reviewModalController.$inject = ['$modalInstance', 'loc8rData', 'locationData'];
	function reviewModalController ($modalInstance, loc8rData, locationData) {
		var vm = this;
		vm.locationData = locationData;

		vm.onSubmit = function () {
			vm.formError = "";
			if (!vm.formData || !vm.formData.name || !vm.formData.rating || !vm.formData.reviewText) {
				vm.formError = "All fields are required, please try again";
				return false;
			}

			vm.doAddReview(vm.locationData.locationId, vm.formData);
		};

		vm.doAddReview = function (locationId, formData) {
			loc8rData.addReviewById(locationId, {
				author : formData.name,
				rating : formData.rating,
				reviewText : formData.reviewText
			})
			.success(function (data) {
				vm.modal.close(data);
			})
			.error(function (data) {
				vm.formError = "Your review has not been saved, try again";
			});

			return false;
		};

		vm.modal = {
			close : function (result) {
				$modalInstance.close(result);
			},
			cancel : function () {
				$modalInstance.dismiss('cancel');
			}
		};		
	};

})();