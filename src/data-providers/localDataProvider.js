angularGrid.module.directive("localDataProvider", function () {

	function localDataProviderController($scope) {
		var controller = {};

		controller.requestSort = function (sortProperty, descending) {
		};

		controller.requestPageChange = function(pageNumber, pageSize) {
		};

		controller.requestFilter = function(filter) {
		};

		return controller;
	}

	return {
		scope: {
			model: "="
		},
		restrict: "EA",
		require: "^grid",
		link: function(scope, elem, attrs, gridController) {
			elem.remove();
			gridController.registerDataProvider(localDataProviderController(scope));
			gridController.setData(scope.model);
		},
		controller: localDataProviderController
	};
});