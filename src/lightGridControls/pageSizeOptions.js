angular.module("lightGridControls").directive("lgPageSizeOptions", function ($window) {
	"use strict";

	return {
		scope: {
			provider: "=",
			pageSizeOptions: "=?options"
		},
		template: "<div class='page-size'>" +
			"<select class='form-control' ng-options='size for size in pageSizeOptions' ng-model='pageSize' ng-change='pageSizeChanged()'></select>" +
			"</div>",
		link: function pageSizeOptionsLink($scope) {
			var DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];
			$scope.pageSizeOptions = $scope.pageSizeOptions || DEFAULT_PAGE_SIZE_OPTIONS;
			$scope.pageSize = $scope.provider.getCurrentViewSettings().limitTo.limit;
			appendPotentiallyMissingPageSizeToOptions();

			$scope.pageSizeChanged = function () {
				$scope.provider.limitTo($scope.pageSize, 0);
				appendPotentiallyMissingPageSizeToOptions();
			};

			$scope.$watchCollection("pageSizeOptions", function validatePageSizeOptions() {
				var valid = true;

				if (!angular.isArray($scope.pageSizeOptions)) {
					valid = false;
				}

				if (valid && $scope.pageSizeOptions.length <= 0) {
					valid = false;
				}

				if (valid && !$scope.pageSizeOptions.every(function (item) {
					return angular.isNumber(item);
				})) {
					valid = false;
				}

				if (!valid) {
					$window.console.warn("Page size options are incorrect, using default values", $scope.pageSizeOptions);
					$scope.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
				}

				appendPotentiallyMissingPageSizeToOptions();
			});

			$scope.$watch("$scope.provider.getCurrentViewSettings().limitTo.limit", function (newLimit) {
				$scope.pageSize = newLimit;
				appendPotentiallyMissingPageSizeToOptions();
			});

			function appendPotentiallyMissingPageSizeToOptions() {
				if (!angular.isNumber($scope.pageSize)) {
					return;
				}

				if ($scope.pageSizeOptions.indexOf($scope.pageSize) === -1) {
					$scope.pageSizeOptions.push($scope.pageSize);
					$scope.pageSizeOptions = $scope.pageSizeOptions.sort(function (a, b) {
						return a - b;
					});
				}
			}
		}
	};
});
