grid.module.directive("ajaxDataProvider", ["$http", function ($http) {
	"use strict";
	
	function AjaxDataProviderController() {
		this.getData = function (options) {
			throw new Error("Not implemented");
		};

		this.sort = function (sortProperty, descending) {
			throw new Error("Not implemented");
		};

		this.changePage = function (pageNumber, pageSize) {
			throw new Error("Not implemented");
		};

		this.filter = function (filter) {
			throw new Error("Not implemented");
		};

		this.updateRecords = function (rows) {
			throw new Error("Not implemented");
		};

		this.addRecord = function (record) {
			throw new Error("Not implemented");
		};

		this.deleteRecord = function (removeRecord) {
			throw new Error("Not implemented");
		};
	}

	return {
		scope: {
			url: "@"
		},
		restrict: "EA",
		require: "^lightGrid",
		controllerAs: "controller",
		controller: AjaxDataProviderController,
		link: function (scope, elem, attrs, gridController) {
			elem.remove();
			gridController.registerDataProvider(scope.controller);
			$http.get(scope.url).success(function(data) {
				gridController.setData(data);
			});
		},
	};
}]);