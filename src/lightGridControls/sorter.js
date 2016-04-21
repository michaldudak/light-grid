/**
 * Enables sorting data by a column specified by the sort-property attribute
 * This directive is meant to be used in header template.
 */
angular.module("lightGridControls").directive("lgSorter", function ($timeout) {
	"use strict";

	return {
		template: "<span class='sorter {{ cssClass }}'><span ng-transclude class='columnTitle'></span></span>",
		transclude: true,
		replace: true,
		scope: true,
		link: function sorterLink(scope, elem, attrs) {
			var sortProperty = attrs.sortProperty || attrs.lgSorter;
			var dataProvider = scope.$eval(attrs.provider);

			scope.dataProvider = dataProvider;

			function updateCssClass() {
				if (!scope.isSorted) {
					scope.cssClass = "";
				} else {
					scope.cssClass = scope.sortDirectionDescending ? "sorter-desc" : "sorter-asc";
				}
			}

			scope.isSorted = false;
			scope.sortDirectionDescending = true;

			elem.on("click", function () {
				$timeout(function () {
					dataProvider.orderBy(sortProperty, !scope.sortDirectionDescending);
				});
			});

			scope.$watch("dataProvider.getCurrentViewSettings().orderBy", function (sortSettings) {
				if (!sortSettings) {
					scope.isSorted = false;
					scope.sortDirectionDescending = true;
				} else {
					scope.isSorted = sortProperty === sortSettings.expression;
					scope.sortDirectionDescending = scope.isSorted ? sortSettings.reverse : true;
				}

				updateCssClass();
			});
		}
	};
});
