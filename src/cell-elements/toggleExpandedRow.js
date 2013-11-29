/* global grid */

/**
 * Opens or closes the expanded view of the row.
 * This can be only used as an attribute . It's value specifies the name of the template
 * used as an expanded row content.
 */
grid.module.directive("lgToggleExpandedRow", function () {
	"use strict";
	
	return {
		require: "^?lgRow",
		link: function(scope, elem, attrs, rowController) {
			var detailsTemplate = attrs.lgToggleExpandedRow || attrs.detailsTemplate;

			elem.on("click", function () {
				rowController.toggleDetails(detailsTemplate);
				
				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
	};
});