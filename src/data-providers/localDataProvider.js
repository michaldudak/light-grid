function LocalDataProvider(originalModel, filterFilter, orderByFilter, limitToFilter, defaultViewSettings) {

	var viewSettings;
	var viewModel;

	function updateFilters() {
		viewModel = originalModel;

		if (viewSettings.filter) {
			viewModel = filterFilter(viewModel, viewSettings.filter.expression, viewSettings.filter.comparator);
		}

		if (viewSettings.orderBy) {
			viewModel = orderByFilter(viewModel, viewSettings.orderBy.expression, viewSettings.orderBy.reverse);
		}

		if (viewSettings.limitTo) {
			viewModel = limitToFilter(viewModel, viewSettings.limitTo.limit, viewSettings.limitTo.begin);
		}
	}

	this.getGridModel = function() {
		return viewModel;
	};

	this.getCurrentViewSettings = function() {
		return viewSettings;
	};

	this.saveModel = function () {
	};

	this.orderBy = function (expression, reverse) {
		viewSettings.orderBy = {
			expression: expression,
			reverse: reverse
		};

		updateFilters();
	};

	this.limitTo = function (limit, begin) {
		viewSettings.limitTo = {
			limit: limit,
			begin: begin
		};

		updateFilters();
	};

	this.page = function (pageIndex) {
		if (viewSettings.limitTo && viewSettings.limitTo.limit) {
			viewSettings.limitTo.begin = viewSettings.limitTo.limit * pageIndex;
		}

		updateFilters();
	};

	this.filter = function (expression, comparator) {
		viewSettings.filter = {
			expression: expression,
			comparator: comparator
		};

		updateFilters();
	};

	this.reset = function () {
		viewSettings = angular.copy(defaultViewSettings);
		updateFilters();
	};

	this.reset();
}

angular.module("light-grid").provider("lgLocalDataProviderFactory", function () {

	var self = this;

	this.defaultViewSettings = {
		orderBy: null,
		limitTo: null,
		filter: null
	};

	this.$get = function(filterFilter, orderByFilter, limitToFilter) {
		return {
			create: function(localModel) {
				return new LocalDataProvider(localModel, filterFilter, orderByFilter, limitToFilter, self.defaultViewSettings);
			}
		};
	};
});
