grid.module.directive("localDataProvider", function () {
	"use strict";

	function LocalDataProviderController() {
		this.sort = function (sortProperty, descending) {
			throw new Error("Not implemented");
		};

		this.changePage = function (pageNumber, pageSize) {
			throw new Error("Not implemented");
		};

		this.filter = function (filter) {
			throw new Error("Not implemented");
		};

		this.persistData = function (rows) {
			throw new Error("Not implemented");
		};

		this.addRecord = function (record) {
			throw new Error("Not implemented");
		};

		this.removeRecord = function (removeRecord) {
			throw new Error("Not implemented");
		};
	}
	
	return {
		scope: true,
		restrict: "EA",
		require: "^lightGrid",
		controllerAs: "controller",
		controller: LocalDataProviderController,
		link: function (scope, elem, attrs, gridController) {
			var model = scope.$eval(attrs.localDataProvider || attrs.model);

			elem.remove();
			gridController.registerDataProvider(scope.controller);
			gridController.setData(model);
		},
	};
});