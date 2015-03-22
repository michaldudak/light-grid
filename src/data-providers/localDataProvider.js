angular.module("light-grid").filter("foo", function() {
	return function(model, dataProvider) {
		return dataProvider.getViewModel(model);
	};
});

angular.module("light-grid").provider("lgLocalDataProviderFactory", function () {

	var self = this;

	this.defaultViewSettings = {
		orderBy: null,
		limitTo: null,
		filter: null
	};

	this.$get = function($parse, filterFilter, orderByFilter, limitToFilter) {
		return {
			create: function() {
				function LocalDataProvider() {
					var viewSettings = self.defaultViewSettings;

					this.getViewModel = function(originalModel) {
						var viewModel = originalModel;

						if (viewSettings.filter) {
							viewModel = filterFilter(viewModel, viewSettings.filter.expression, viewSettings.filter.comparator);
						}

						if (viewSettings.orderBy) {
							viewModel = orderByFilter(viewModel, viewSettings.orderBy.expression, viewSettings.orderBy.reverse);
						}

						if (viewSettings.limitTo) {
							viewModel = limitToFilter(viewModel, viewSettings.limitTo.limit, viewSettings.limitTo.begin);
						}

						return viewModel;
					};

					this.saveModel = function() {
					};

					this.orderBy = function(expression, reverse) {
						viewSettings.orderBy = {
							expression: expression,
							reverse: reverse
						};
					};

					this.limitTo = function(limit, begin) {
						viewSettings.limitTo = {
							limit: limit,
							begin: begin
						};
					};

					this.page = function(pageIndex) {
						if (viewSettings.limitTo && viewSettings.limitTo.limit) {
							viewSettings.limitTo.begin = viewSettings.limitTo.limit * pageIndex;
						}
					};

					this.filter = function(expression, comparator) {
						viewSettings.filter = {
							expression: expression,
							comparator: comparator
						};
					};

					this.reset = function() {
						viewSettings = self.defaultViewSettings;
					};
				}

				return new LocalDataProvider();
			}
		};
	};
});

/**
 * Data provider to be used with a local array as a model.
 * Attributes:
 *  - model (interpolated) - an array with a data model to display
 *  - initial-options (interpolated, optional) - an object containing the initial view options (search, sorting, paging)
 */
angular.module("light-grid").directive("lgLocalDataProvider", function (lgGridService, $filter, $rootScope) {
	"use strict";

	var defaultOptions = {
		sortProperty: null,
		sortDirectionDescending: false,
		pageNumber: 1,
		pageSize: null,
		filter: null
	};

	/**
	 * Filters the input array according to specified criteria.
	 * @param {Array} model - model to filter
	 * @param {object} options - filtering criteria
	 * @returns {{model: Array, recordCount: Number}}
	 */
	function applyFilters(model, options) {
		var viewModel = model;

		if (options.filter) {
			var filter = $filter("filter");
			viewModel = filter(viewModel, options.filter);
		}

		// recordCount stores the number of results after filtering but before paging
		var recordCount = viewModel.length;

		if (options.sortProperty) {
			var orderBy = $filter("orderBy");
			viewModel = orderBy(viewModel, options.sortProperty, options.sortDirectionDescending);
		}

		if (options.pageNumber && options.pageSize) {
			var startIndex = (options.pageNumber - 1) * options.pageSize;
			var endIndex = startIndex + options.pageSize;

			viewModel = viewModel.slice(startIndex, endIndex);
		}

		return {
			model: viewModel,
			recordCount: recordCount
		};
	}

	function updateGridModel(scope) {
		var gridController = lgGridService.getGridController(scope.gridId);
		var modelInfo = applyFilters(scope.model, scope.displayedDataProperties);
		scope.viewModel = modelInfo.model;

		gridController.setData(scope.viewModel);

		// notifying other components that the displayed data may have changed
		$rootScope.$broadcast("lightGrid.dataUpdated", scope.gridId, {
			model: scope.model,
			recordCount: modelInfo.recordCount,
			viewOptions: scope.displayedDataProperties
		});

		if (!scope.$$phase && !$rootScope.$$phase) {
			scope.$apply();
		}
	}

	var localDataProviderController = function ($scope, $q) {
		this.getViewProperties = function () {
			return $scope.displayedDataProperties;
		};

		this.sort = function (sortProperty, descending) {
			angular.extend($scope.displayedDataProperties, { sortProperty: sortProperty, sortDirectionDescending: descending });
			updateGridModel($scope);
		};

		this.changePage = function (pageNumber, pageSize) {
			angular.extend($scope.displayedDataProperties, { pageNumber: pageNumber, pageSize: pageSize });
			updateGridModel($scope);
		};

		this.filter = function (filter) {
			angular.extend($scope.displayedDataProperties, { filter: filter, pageNumber: 1 });
			updateGridModel($scope);
		};

		this.updateRecords = function () {
			// local model is updated immediately, so nothing to do here
		};

		this.addRecord = function (record) {
			var deferred = $q.defer();

			$scope.model.push(record);

			deferred.resolve();
			return deferred.promise;
		};

		this.deleteRecord = function (record) {
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
	};

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
			if (!gridController && !attrs.gridId) {
				throw Error("lgLocalDataProvider has no associated grid.");
			}

			scope.gridId = gridController ? gridController.getId() : attrs.gridId;

			scope.displayedDataProperties = angular.extend({}, defaultOptions, scope.initialOptions);

			scope.$watch("model", function () {
				updateGridModel(scope);
			});

			scope.$watchCollection("model", function() {
				updateGridModel(scope);
			});

			lgGridService.registerDataProvider(scope.gridId, scope.controller);
			elem.remove();
		}
	};
});
