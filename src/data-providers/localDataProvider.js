grid.module.directive("localDataProvider", function () {
	"use strict";

	function LocalDataProviderController($scope) {
		this.getData = function(options) {
			return $scope.model;
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

		this.updateRecords = function (records) {
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
			model: "="
		},
		restrict: "EA",
		require: "^lightGrid",
		controllerAs: "controller",
		controller: ["$scope", LocalDataProviderController],
		link: function (scope, elem, attrs, gridController) {
			gridController.registerDataProvider(scope.controller);
			
			scope.$watch("model", function (model) {
				gridController.setData(model);
			});
			
			elem.remove();
		},
	};
});