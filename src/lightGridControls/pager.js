angular.module("lightGridControls").directive("lgPager", function () {
	"use strict";

	return {
		scope: {
			provider: "=",
			pageSizeOptions: "@"
		},
		template: "<div class='pager'>" +
			"<button ng-disabled='isFirst' class='first' ng-click='goToFirst()'>Last</button>" +
			"<button ng-disabled='isFirst' class='previous' ng-click='goToPrevious()'>Previous</button>" +
			"<span class='pager-summary'>Page {{currentPage + 1}} of {{pageCount}}</span>" +
			"<button ng-disabled='isLast' class='next' ng-click='goToNext()'>Next</button>" +
			"<button ng-disabled='isLast' class='last' ng-click='goToLast()'>Last</button>" +
			"</div>" +
			"<div class='page-size'><select class='form-control' ng-options='pageSize for pageSize in pageSizes' ng-model='currentPageSize'></select></div>",
		link: function pagerLink($scope) {
			var DEFAULT_PAGE_SIZE_OPTIONS = "10,20,50";
			
			$scope.pageSizeOptions = $scope.pageSizeOptions || DEFAULT_PAGE_SIZE_OPTIONS;
			$scope.pageSizes = $scope.pageSizeOptions
				.split(",")
				.map(function(pso) {
					return parseInt(pso, 10);
				})
				.filter(function(pso) {
					return !isNaN(pso);
				});
						
			$scope.currentPageSize = $scope.pageSizes[0];
			
			function calculateCurrentPage(currentIndex, pageSize) {
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
				} else {
					$scope.currentPage = calculateCurrentPage(limitToSettings.begin, limitToSettings.limit);
					$scope.pageCount = calculatePageCount(limitToSettings.limit, totalItemCount);
					$scope.pageSize = limitToSettings.limit;
				}

				$scope.isFirst = $scope.currentPage <= 0;
				$scope.isLast = $scope.currentPage >= $scope.pageCount - 1;
			}
			
			function goToPage(pageNumber) {
				var firstIndex = $scope.pageSize * pageNumber;
				$scope.provider.limitTo($scope.pageSize, firstIndex);
			}

			$scope.$watch("provider.getCurrentViewSettings().limitTo", function (limitToSettings) {
				update(limitToSettings);
			}, true);

			$scope.$watch("provider.getModelItemCount()", function () {
				update($scope.provider.getCurrentViewSettings().limitTo);
			});
			
			$scope.$watch("currentPageSize", function(value) {
				$scope.provider.limitTo(value, 0);
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
