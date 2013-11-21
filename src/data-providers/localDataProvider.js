/* global grid */

grid.module.directive("lgLocalDataProvider", ["lgGridService", "$filter", function (lgGridService, $filter) {
	"use strict";

	var defaultOptions = {
		sortProperty: null,
		sortDirectionDescending: false,
		pageNumber: null,
		pageSize: null,
		filter: null
	};
	
	function applyFilters(model, options) {
		var viewModel = model.data;

		if (options.filter) {
			var filter = $filter("filter");
			viewModel = filter(viewModel, options.filter);
		}

		if (options.sortProperty) {
			var orderBy = $filter("orderBy");
			viewModel = orderBy(viewModel, options.sortProperty, options.sortDirectionDescending);
		}

		if (options.pageNumber && options.pageSize) {
			var startIndex = (options.pageNumber - 1) * options.pageSize;
			var endIndex = startIndex + options.pageSize;

			viewModel = viewModel.slice(startIndex, endIndex);
		}

		return viewModel;
	}

	function updateGridModel(scope) {
		var gridController = lgGridService.getGridController(scope.gridId);
		scope.viewModel = applyFilters(scope.model, scope.displayedDataProperties);
		gridController.setData(scope.viewModel);
	}

	var localDataProviderController = ["$scope", "$q", function ($scope, $q) {
		this.sort = function(sortProperty, descending) {
			$.extend($scope.displayedDataProperties, { sortProperty: sortProperty, sortDirectionDescending: descending });
			updateGridModel($scope);
		};

		this.changePage = function(pageNumber, pageSize) {
			$.extend($scope.displayedDataProperties, { pageNumber: pageNumber, pageSize: pageSize });
			updateGridModel($scope);
		};

		this.filter = function(filter) {
			$.extend($scope.displayedDataProperties, { filter: filter, pageNumber: 1 });
			updateGridModel($scope);
		};

		this.updateRecords = function() {
			// local model is updated immediately, so nothing to do here
		};

		this.addRecord = function (record) {
			var deferred = $q.defer();

			$scope.model.push(record);

			deferred.resolve();
			return deferred.promise;
		};

		this.deleteRecord = function(record) {
			var deferred = $q.defer();
			var deleteIndex = null;

			for (var i = 0; i < $scope.model.length; ++i) {
				if ($scope.model[i] === record) {
					deleteIndex = i;
					break;
				}
			}
			
			if (deleteIndex !== null) {
				$scope.model.splice(deleteIndex, 1);
				deferred.resolve();
			} else {
				deferred.reject();
			}

			return deferred.promise;
		};
	}];
	
	return {
		scope: {
			model: "=",
			initialOptions: "=?"
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
			
			scope.displayedDataProperties = $.extend({}, defaultOptions, scope.initialOptions);
			
			scope.$watch("model", function () {
				updateGridModel(scope);
			});

			lgGridService.registerDataProvider(scope.gridId, scope.controller);
			elem.remove();
		},
	};
}]);