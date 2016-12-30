(function () {
	angular
		.module('loc8rApp')
		.controller('aboutController', aboutController);

	function aboutController () {
		var vm = this;

		vm.pageHeader = {
			title : 'About Loc8r'
		};

		vm.main = {
			content : 'Loc8r was created to help people find places to sit down and get a bit of work done.\n\n'
          + 'Lorem ipsum dolo sit amet, consectetur adipiscing elit.  Nunc sed lorem ac nisi dignissim accumsan.'
		}
	};
})();