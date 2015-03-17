/**
 * Represents a row inside grid's header.
 * Does not expose any API.
 */
angular.module("light-grid").directive("lgHeaderRow", function headerRowDirective() {
	"use strict";

	return {
		template: "<th lg-header-cell ng-repeat='columnDefinition in visibleColumns'></th>"
	};
});