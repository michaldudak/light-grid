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
		restrict: "A",
		require: "^lightGrid",
		link: function (scope, elem, attrs, gridController) {
			if (!scope.columnDefinition.headerTemplate) {
				return;
			}

			// same as in the lgCell directive
			var transclusionScope = gridController.getScope().$parent.$new();
			transclusionScope.data = scope.data;
			transclusionScope.gridController = scope.gridController;
			transclusionScope.title = scope.columnDefinition.title;
			
			if (scope.columnDefinition.attributes.width) {
				elem.width(scope.columnDefinition.attributes.width);
			}

			elem.html("");
			
			// link the header template with the correct scope...
			scope.columnDefinition.headerTemplate(transclusionScope, function (clone) {
				// ...and insert the linked template inside the directive root element
				elem.append(clone);
			});
		}
	};
});