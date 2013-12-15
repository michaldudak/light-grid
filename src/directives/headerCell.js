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
		link: function (scope, element, attrs, gridController) {
			// CSS class defined on column template is copied to the rendered TH element
			element.addClass(scope.columnDefinition.attributes.class);

			if (!scope.columnDefinition.headerTemplate) {
				return;
			}

			// same as in the lgCell directive
			var transclusionScope = gridController.createTransclusionScope();
			transclusionScope.data = scope.data;
			transclusionScope.gridController = scope.gridController;
			transclusionScope.title = scope.columnDefinition.title;
			
			if (scope.columnDefinition.attributes.width) {
				element.css("width", scope.columnDefinition.attributes.width);
			}

			element.empty();
			
			// link the header template with the correct scope...
			scope.columnDefinition.headerTemplate(transclusionScope, function (clone) {
				// ...and insert the linked template inside the directive root element
				element.append(clone);
			});
		}
	};
});