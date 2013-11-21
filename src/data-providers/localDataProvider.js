/* global grid */

grid.module.directive("lgLocalDataProvider", ["lgGridService", function (lgGridService) {
	"use strict";

	var localDataProviderController = ["$scope", "$q", "$filter", function ($scope, $q, $filter) {
		var modelData = [];

		this.setModel = function (modelPromise) {
			$q.when(modelPromise).then(function (model) {
				var gridController = lgGridService.getGridController($scope.gridId);
				modelData = model.data;
				gridController.setData(modelData);
			});
		};

		this.sort = function(sortProperty, descending) {
			modelData = $filter("orderBy")(modelData, sortProperty, descending);
			var gridController = lgGridService.getGridController($scope.gridId);
			gridController.setData(modelData);
		};

		this.changePage = function(/*pageNumber, pageSize*/) {
			throw new Error("Not implemented");
		};

		this.filter = function(/*filter*/) {
			throw new Error("Not implemented");
		};

		this.updateRecords = function(/*records*/) {
			throw new Error("Not implemented");
		};

		this.addRecord = function(/*record*/) {
			throw new Error("Not implemented");
		};

		this.deleteRecord = function(/*removeRecord*/) {
			throw new Error("Not implemented");
		};
	}];
	
	return {
		scope: {
			model: "="
		},
		restrict: "EA",
		require: "^?lightGrid",
		controllerAs: "controller",
		controller: localDataProviderController,
		link: function (scope, elem, attrs, gridController) {

			if (gridController) {
				scope.gridId = gridController.getId();
			} else {
				scope.gridId = attrs.gridId;
			}
			
			scope.$watch("model", function (model) {
				var gridCtrl = gridController || lgGridService.getGridController(scope.gridId);
				scope.controller.setModel(model);
			});

			lgGridService.registerDataProvider(scope.gridId, scope.controller);
			
			elem.remove();
		},
	};
}]);