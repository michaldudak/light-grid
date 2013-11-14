grid.module.directive("lgCustomDataProvider", [function () {
	"use strict";

	var customDataProviderController = ["$scope", "$q", function CustomDataProviderController($scope, $q) {
		var displayedDataProperties = {
			sortProperty: null,
			sortDirectionDescending: false,
			pageNumber: null,
			pageSize: null,
			filter: null
		};

		var self = this;

		this.getData = function(options) {
			return $q.when($scope.getMethod({ options: options }));
		};

		this.sort = function(sortProperty, descending) {
			var properties = $.extend(displayedDataProperties, { sortProperty: sortProperty, sortDirectionDescending: descending });
			return self.getData(properties);
		};

		this.changePage = function(pageNumber, pageSize) {
			var properties = $.extend(displayedDataProperties, { pageNumber: pageNumber, pageSize: pageSize });
			return self.getData(properties);
		};

		this.filter = function(filter) {
			var properties = $.extend(displayedDataProperties, { filter: filter });
			return self.getData(properties);
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
			deleteMethod: "&"
		},
		restrict: "EA",
		require: "^lightGrid",
		controllerAs: "controller",
		controller: customDataProviderController,
		link: function (scope, elem, attrs, gridController) {
			elem.remove();
			gridController.registerDataProvider(scope.controller);
		},
	};
}]);