/**
 * Template for the header (defined in the lgColumn)
 * Does not expose any API.
 */
angular.module("lightGrid").directive("lgHeaderView", function () {
	"use strict";

	return {
		restrict: "EA",
		require: "^?lgColumn",
		transclude: true,
		link: function (scope, instanceElement, instanceAttrs, templateColumnController, linker) {
			instanceElement.remove();
			templateColumnController.registerHeaderTemplate(linker);
		}
	};
});
