/* global grid */

/**
 * Enables sorting data by a column specified by the sort-property attribute
 * This directive is meant to be used in header template.
 */
grid.module.directive("lgSorter", ["lgGridService", function (lgGridService) {
	"use strict";

	return {
		template: "<span class='sorter {{ cssClass() }}'><span ng-transclude class='columnTitle'></span></span>",
		transclude: true,
		replace: true,
		link: function (scope, elem, attrs) {
			var gridId = scope.gridController.getId();
			var sortProperty = attrs.sortProperty || attrs.lgSorter;

			scope.isSorted = false;
			scope.sortDirectionDescending = true;

			elem.on("click", function () {
				var dataProvider = lgGridService.getDataProvider(gridId);
				dataProvider.sort(sortProperty, !scope.sortDirectionDescending);
			});

			scope.$on("lightGrid.dataUpdated", function (event, sortedGridId, gridProperties) {
				if (gridId !== sortedGridId) {
					return;
				}

				var sortOptions = gridProperties.viewOptions;

				if (sortOptions.sortProperty !== sortProperty) {
					scope.isSorted = false;
					scope.sortDirectionDescending = true;
				} else {
					scope.isSorted = true;
					scope.sortDirectionDescending = sortOptions.sortDirectionDescending;
				}

				if (!scope.$$phase) {
					scope.$digest();
				}
			});

			scope.cssClass = function () {
				if (!scope.isSorted) {
					return "";
				}

				return scope.sortDirectionDescending ? "sorter-desc" : "sorter-asc";
			};
		}
	};
}]);