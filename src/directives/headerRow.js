/* global grid */

/**
 * Represents a row inside grid's header.
 * Does not expose any API.
 */
grid.module.directive("lgHeaderRow", function headerRowDirective() {
	"use strict";

	return {
		template: "<th lg-header-cell ng-repeat='columnDefinition in columnDefinitions'></th>",
	};
});