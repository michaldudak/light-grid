grid.module.directive("customDataProvider", [function () {
	"use strict";

	function CustomDataProviderController($scope) {
		var displayedDataProperties = {
			sortProperty: null,
			sortDirectionDescending: false,
			pageNumber: null,
			pageSize: null,
			filter: null
		};

		var self = this;

		this.getData = function (options) {
			return $scope.getMethod({ options: options });
		};

		this.sort = function (sortProperty, descending) {
			var properties = $.extend(displayedDataProperties, { sortProperty: sortProperty, sortDirectionDescending: descending });
			self.getData(properties);
		};

		this.changePage = function (pageNumber, pageSize) {
			var properties = $.extend(displayedDataProperties, { pageNumber: pageNumber, pageSize: pageSize });
			self.getData(properties);
		};

		this.filter = function (filter) {
			var properties = $.extend(displayedDataProperties, { filter: filter });
			self.getData(properties);
		};

		this.updateRecords = function (records) {
			$scope.updateMethod({ records: records });
		};

		this.addRecord = function (record) {
			$scope.addMethod({ record: record });
		};

		this.deleteRecord = function (record) {
			$scope.deleteMethod({ record: record });
		};
	}

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
		controller: ["$scope", CustomDataProviderController],
		link: function (scope, elem, attrs, gridController) {
			elem.remove();
			gridController.registerDataProvider(scope.controller);
		},
	};
}]);