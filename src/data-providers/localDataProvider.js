grid.module.directive("localDataProvider", [function () {
	"use strict";

	var localDataProviderController = ["$scope", "$q", function LocalDataProviderController($scope, $q) {
		this.getData = function(options) {
			return $q.when(function() {
				return { data: $scope.model };
			});
		};

		this.sort = function(sortProperty, descending) {
			throw new Error("Not implemented");
		};

		this.changePage = function(pageNumber, pageSize) {
			throw new Error("Not implemented");
		};

		this.filter = function(filter) {
			throw new Error("Not implemented");
		};

		this.updateRecords = function(records) {
			throw new Error("Not implemented");
		};

		this.addRecord = function(record) {
			throw new Error("Not implemented");
		};

		this.deleteRecord = function(removeRecord) {
			throw new Error("Not implemented");
		};
	}];
	
	return {
		scope: {
			model: "="
		},
		restrict: "EA",
		require: "^lightGrid",
		controllerAs: "controller",
		controller: localDataProviderController,
		link: function (scope, elem, attrs, gridController) {
			gridController.registerDataProvider(scope.controller);
			
			scope.$watch("model", function (model) {
				gridController.setData(model);
			});
			
			elem.remove();
		},
	};
}]);