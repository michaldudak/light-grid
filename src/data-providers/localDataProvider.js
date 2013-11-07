angularGrid.module.directive("localDataProvider", function () {

	function localDataProviderController() {
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
		
		restrict: "EA",
		require: "^grid",
		link: function(scope, elem, attrs, gridController) {
			var model = scope.$eval(attrs.localDataProvider || attrs.model);

			elem.remove();
			gridController.registerDataProvider(localDataProviderController());
			gridController.setData(model);
		},
		controller: localDataProviderController
	};
});