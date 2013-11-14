/**
 * Represents a cell in a header of a table.
 * Does not expose any API.
 */
grid.module.directive("lgHeaderCell", [function headerCellDirective() {
	return {
		template: "{{columnDefinition.title}}",
		replace: false,
		restrict: "A"
	};
}]);