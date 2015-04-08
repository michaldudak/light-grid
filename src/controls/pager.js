angular.module("light-grid").directive("lgPager", function () {
	"use strict";

	return {
		scope: {
			provider: "="
		},
		template: "<div class='pager'>" +
			"<button ng-disabled='isFirst' class='first' ng-click='goToFirst()'>f</button>" +
			"<button ng-disabled='isFirst' class='previous' ng-click='goToPrevious()'>p</button>" +
			"<button ng-disabled='isLast' class='next' ng-click='goToNext()'>n</button>" +
			"<button ng-disabled='isLast' class='last' ng-click='goToLast()'>l</button>" +
			"</div>",
		link: function ($scope) {
			var DEFAULT_PAGE_SIZE = 10;

			function calculateCurrentPage(currentIndex, pageSize) {
				return Math.floor(currentIndex / (pageSize || DEFAULT_PAGE_SIZE));
			}

			function calculatePageCount(pageSize, totalSize) {
				return Math.ceil(totalSize / (pageSize || DEFAULT_PAGE_SIZE));
			}

			$scope.$watch("provider.getCurrentViewSettings().limitTo", function (limitToSettings) {
				var totalItemCount = $scope.provider.getModelItemCount();
				$scope.currentPage = !limitToSettings ? 0 : calculateCurrentPage(limitToSettings.begin, limitToSettings.limit);
				$scope.pageCount = calculatePageCount(limitToSettings.limit, totalItemCount);

				$scope.isFirst = $scope.currentPage === 0;
				$scope.isLast = $scope.currentPage === $scope.pageCount - 1;
			}, true);

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
