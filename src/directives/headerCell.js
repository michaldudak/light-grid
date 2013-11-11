/**
 * Represents a cell in a header of a table.
 * Does not expose any API.
 */
grid.module.directive("headerCell", [function headerCellDirective() {
	return {
		template: "{{columnDefinition.title}}",
		replace: false,
		restrict: "A"
	};
}]);