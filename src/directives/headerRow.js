/* global grid */

grid.module.directive("lgHeaderRow", [function headerRowDirective() {
	"use strict";

	return {
		restrict: "A",
		template: "<th lg-header-cell ng-repeat='columnDefinition in columnDefinitions'></th>",
	};
}]);