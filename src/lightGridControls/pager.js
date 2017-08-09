angular.module("lightGridControls").directive("lgPager", function () {
	"use strict";

	return {
		scope: {
			provider: "="
		},
		template: "<div class='pager'>" +
			"<button ng-disabled='isFirst' class='first' ng-click='goToFirst()'>First</button>" +
			"<button ng-disabled='isFirst' class='previous' ng-click='goToPrevious()'>Previous</button>" +
			"<span class='pager-summary'>Page {{currentPage + 1}} of {{pageCount}}</span>" +
			"<button ng-disabled='isLast' class='next' ng-click='goToNext()'>Next</button>" +
			"<button ng-disabled='isLast' class='last' ng-click='goToLast()'>Last</button>" +
			"</div>",
		link: function pagerLink($scope) {
			var pageSize;

			$scope.$watch("provider", function (newProvider) {
				if (!newProvider) {
					return;
				}

				update(newProvider.getCurrentViewSettings().limitTo);
				goToPage(0);
			});

			function calculateCurrentPage(currentIndex, pageSize, totalItemCount) {
				if (totalItemCount === 0) {
					return -1;
				}

				return Math.floor(currentIndex / pageSize);
			}

			function calculatePageCount(pageSize, totalSize) {
				return Math.ceil(totalSize / pageSize);
			}

			function update(limitToSettings) {
				var totalItemCount = $scope.provider.getModelItemCount();

				if (!limitToSettings) {
					$scope.currentPage = 0;
					$scope.pageCount = 1;
					pageSize = 1;
				} else {
					$scope.currentPage = calculateCurrentPage(limitToSettings.begin, limitToSettings.limit, totalItemCount);
					$scope.pageCount = calculatePageCount(limitToSettings.limit, totalItemCount);
					pageSize = limitToSettings.limit;
				}

				$scope.isFirst = $scope.currentPage <= 0;
				$scope.isLast = $scope.currentPage >= $scope.pageCount - 1;
			}

			function goToPage(pageNumber) {
				if (pageNumber < 0) {
					pageNumber = 0;
				} else if (pageNumber >= $scope.pageCount) {
					pageNumber = $scope.pageCount - 1;
				}

				$scope.provider.page(pageNumber);
			}

			$scope.$watch("provider.getCurrentViewSettings().limitTo", function (limitToSettings) {
				update(limitToSettings);
			}, true);

			$scope.$watch("provider.getModelItemCount()", function () {
				update($scope.provider.getCurrentViewSettings().limitTo);
			});

			$scope.goToFirst = function () {
				goToPage(0);
			};

			$scope.goToPrevious = function () {
				goToPage($scope.currentPage - 1);
			};

			$scope.goToNext = function () {
				goToPage($scope.currentPage + 1);
			};

			$scope.goToLast = function () {
				goToPage($scope.pageCount - 1);
			};
		}
	};
});
