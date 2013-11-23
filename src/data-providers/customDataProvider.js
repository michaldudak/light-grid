/* global grid */

grid.module.directive("lgCustomDataProvider", ["lgGridService", "$q", function (lgGridService, $q) {
	"use strict";
	
	var defaultOptions = {
		sortProperty: null,
		sortDirectionDescending: false,
		pageNumber: null,
		pageSize: null,
		filter: null
	};
	
	function updateGridModel(modelPromise, gridController) {
		$q.when(modelPromise).then(function (model) {
			if (model && model.data) {
				gridController.setData(model.data);
			} else {
				gridController.setData({ data: [] });
			}
		});
	}

	var customDataProviderController = ["$scope", function CustomDataProviderController($scope) {
		this.sort = function(sortProperty, descending) {
			var properties = $.extend($scope.displayedDataProperties, { sortProperty: sortProperty, sortDirectionDescending: descending });
			updateGridModel($scope.getMethod({ options: properties }, $scope.gridController));
		};

		this.changePage = function(pageNumber, pageSize) {
			var properties = $.extend($scope.displayedDataProperties, { pageNumber: pageNumber, pageSize: pageSize });
			updateGridModel($scope.getMethod({ options: properties }, $scope.gridController));
		};

		this.filter = function(filter) {
			var properties = $.extend($scope.displayedDataProperties, { filter: filter, pageNumber: 1 });
			updateGridModel($scope.getMethod({ options: properties }, $scope.gridController));
		};

		this.updateRecords = function(records) {
			return $q.when($scope.updateMethod({ records: records }));
		};

		this.addRecord = function(record) {
			return $q.when($scope.addMethod({ record: record }));
		};

		this.deleteRecord = function(record) {
			return $q.when($scope.deleteMethod({ record: record }));
		};
	}];

	return {
		scope: {
			getMethod: "&",
			addMethod: "&",
			updateMethod: "&",
			deleteMethod: "&",
			initialOptions: "=?"
		},
		restrict: "EA",
		require: "^?lightGrid",
		controllerAs: "controller",
		controller: customDataProviderController,
		link: function (scope, elem, attrs, gridController) {
			if (gridController) {
				scope.gridId = gridController.getId();
			} else {
				scope.gridId = attrs.gridId;
			}

			scope.displayedDataProperties = $.extend({}, defaultOptions, scope.initialOptions);
			updateGridModel(scope.getMethod({ options: scope.displayedDataProperties }), gridController);
			
			lgGridService.registerDataProvider(scope.gridId, scope.controller);
			elem.remove();
		}
	};
}]);