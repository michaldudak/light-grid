angularGrid.module.directive("ajaxDataProvider", ["$http", function ($http) {

	function ajaxDataProviderController($scope) {
		var controller = {};

		controller.requestSort = function (sortProperty, descending) {
		};

		controller.requestPageChange = function (pageNumber, pageSize) {
		};

		controller.requestFilter = function (filter) {
		};

		return controller;
	}
	
	return {
		scope: {
			url: "@"
		},
		restrict: "EA",
		require: "^grid",
		link: function (scope, elem, attrs, gridController) {
			elem.remove();
			
			gridController.registerDataProvider(ajaxDataProviderController(scope));
			$http.get(scope.url).success(function(data) {
				gridController.setData(data);
			});
		},
		controller: ajaxDataProviderController
	};
}]);