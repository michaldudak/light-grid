/**
 * Represents a row inside grid's header.
 * Does not expose any API.
 */
angular.module("lightGrid").directive("lgHeaderRow", function headerRowDirective() {
	"use strict";

	return {
		restrict: "A",
		template: "<th lg-header-cell ng-repeat='columnDefinition in visibleColumns'></th>"
	};
});
