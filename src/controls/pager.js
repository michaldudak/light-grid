angular.module("light-grid").directive("lgPager", function () {
	"use strict";

	return {
		scope: {
			provider: "="
		},
		template: "<div class='pager'>" +
			"<button ng-disabled='isFirst' class='first' ng-click='goToFirst()'>Last</button>" +
			"<button ng-disabled='isFirst' class='previous' ng-click='goToPrevious()'>Previous</button>" +
			"<span class='pager-summary'>Page {{currentPage + 1}} of {{pageCount}}</span>" +
			"<button ng-disabled='isLast' class='next' ng-click='goToNext()'>Next</button>" +
			"<button ng-disabled='isLast' class='last' ng-click='goToLast()'>Last</button>" +
			"</div>",
		link: function ($scope) {
			var DEFAULT_PAGE_SIZE = 10;

			function calculateCurrentPage(currentIndex, pageSize) {
				return Math.floor(currentIndex / (pageSize || DEFAULT_PAGE_SIZE));
			}

			function calculatePageCount(pageSize, totalSize) {
				return Math.ceil(totalSize / (pageSize || DEFAULT_PAGE_SIZE));
			}

			function update(limitToSettings) {
				var totalItemCount = $scope.provider.getModelItemCount();

				if (!limitToSettings) {
					$scope.currentPage = 0;
					$scope.pageCount = 1;
				} else {
					$scope.currentPage = calculateCurrentPage(limitToSettings.begin, limitToSettings.limit);
					$scope.pageCount = calculatePageCount(limitToSettings.limit, totalItemCount);
				}

				$scope.isFirst = $scope.currentPage <= 0;
				$scope.isLast = $scope.currentPage >= $scope.pageCount - 1;
			}

			$scope.$watch("provider.getCurrentViewSettings().limitTo", function (limitToSettings) {
				update(limitToSettings);
			}, true);

			$scope.$watch("provider.getModelItemCount()", function () {
				update($scope.provider.getCurrentViewSettings().limitTo);
			});

			$scope.goToFirst = function () {
				$scope.provider.page(0);
			};

			$scope.goToPrevious = function () {
				$scope.provider.page($scope.currentPage - 1);
			};

			$scope.goToNext = function () {
				$scope.provider.page($scope.currentPage + 1);
			};

			$scope.goToLast = function () {
				$scope.provider.page($scope.pageCount - 1);
			};
		}
	};
});
