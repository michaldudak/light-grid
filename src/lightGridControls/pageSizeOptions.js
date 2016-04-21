angular.module("lightGridControls").directive("lgPageSizeOptions", function ($window) {
	"use strict";

	return {
		scope: {
			provider: "=",
			pageSizeOptions: "="
		},
		template: "<div class='page-size'>" +
			"<select class='form-control' ng-options='size for size in pageSizeOptions' ng-model='pageSize' ng-change='pageSizeChanged()'></select>" +
			"</div>",
		link: function pageSizeOptionsLink($scope) {
			var DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];
			$scope.pageSizeOptions = $scope.pageSizeOptions || DEFAULT_PAGE_SIZE_OPTIONS;

			$scope.$watchCollection("pageSizeOptions", function validatePageSizeOptions() {
				var valid = true;

				if (!angular.isArray($scope.pageSizeOptions)) {
					valid = false;
				}

				if (valid && $scope.pageSizeOptions.length <= 0) {
					valid = false;
				}

				if (valid && $scope.pageSizeOptions.every(function (item) {
					return angular.isNumber(item);
				})) {
					valid = false;
				}

				if (!valid) {
					$window.console.warn("Page size options are incorrect, using default values", $scope.pageSizeOptions);
					$scope.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
				}
			});

			$scope.pageSizeChaged = function () {
				$scope.provider.limitTo($scope.pageSize, 0);
			};
		}
	};
});