/* global grid */

/**
 * Represents a cell in a header of a table.
 * Does not expose any API.
 */
grid.module.directive("lgHeaderCell", function headerCellDirective() {
	"use strict";

	return {
		template: "{{columnDefinition.title}}",
		replace: false,
		restrict: "A"
	};
});