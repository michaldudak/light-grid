/* global grid, angular */

/**
 * Customizable data provider.
 * Attributes:
 *  - get-method (function(options)) - method called when the provider need new data. The options parameter contain the view options (filter, paging ans sorting)
 *  - add-method (function(record)) - method called when the provider wants to save a new resource
 *  - update-method (function(records)) - method called when the provider wants to update existing resources
 *  - delete-method(function(record)) - method called when the provider wants to delete an existing resource
 *  - initial-options (interpolated, optional) - an object containing the initial view options (search, sorting, paging)
 */
grid.module.directive("lgCustomDataProvider", ["lgGridService", "$q", "$rootScope", function (lgGridService, $q, $rootScope) {
	"use strict";

	var defaultOptions = {
		sortProperty: null,
		sortDirectionDescending: false,
		pageNumber: null,
		pageSize: null,
		filter: null
	};

	function updateGridModel(modelPromise, scope) {
		// modelPromise may be either a promise or an actual object, so we have to wrap it in
		// $q.when() to make sure it's a promise.
		$q.when(modelPromise).then(function (model) {
			if (model && model.data) {
				scope.gridController.setData(model.data);
			} else {
				scope.gridController.setData({ data: [] });
			}

			if (!scope.$$phase && !$rootScope.$$phase) {
				scope.$apply();
			}
		});
	}

	var customDataProviderController = ["$scope", function CustomDataProviderController($scope) {
		this.sort = function (sortProperty, descending) {
			var properties = angular.extend($scope.displayedDataProperties, { sortProperty: sortProperty, sortDirectionDescending: descending });
			updateGridModel($scope.getMethod({ options: properties }, $scope));
		};

		this.changePage = function (pageNumber, pageSize) {
			var properties = angular.extend($scope.displayedDataProperties, { pageNumber: pageNumber, pageSize: pageSize });
			updateGridModel($scope.getMethod({ options: properties }, $scope));
		};

		this.filter = function (filter) {
			var properties = angular.extend($scope.displayedDataProperties, { filter: filter, pageNumber: 1 });
			updateGridModel($scope.getMethod({ options: properties }, $scope));
		};

		this.updateRecords = function (records) {
			return $q.when($scope.updateMethod({ records: records }));
		};

		this.addRecord = function (record) {
			return $q.when($scope.addMethod({ record: record }));
		};

		this.deleteRecord = function (record) {
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
			// TODO: this looks quite error-prone
			if (gridController) {
				scope.gridId = gridController.getId();
				scope.gridController = gridController;
			} else {
				scope.gridId = attrs.gridId;
			}

			lgGridService.registerDataProvider(scope.gridId, scope.controller);

			scope.displayedDataProperties = angular.extend({}, defaultOptions, scope.initialOptions);
			var modelPromise = scope.getMethod({ options: scope.displayedDataProperties });
			updateGridModel(modelPromise, scope);
			
			elem.remove();
		}
	};
}]);