/**
 * Opens or closes the expanded view of the row.
 * This can be only used as an attribute. Its value specifies the name of the template
 * used as an expanded row content.
 */
angular.module("lightGridControls").directive("lgToggleExpandedRow", function () {
	"use strict";

	return {
		require: "^?lgRow",
		restrict: "A",
		link: function toggleExpandedRowLink(scope, elem, attrs, rowController) {
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
