/* global grid */

/**
 * Template for the header (defined in the lgColumn)
 * Does not expose any API.
 */
grid.module.directive("lgHeaderView", function () {
	"use strict";

	return {
		scope: {},
		restrict: "EA",
		require: "^?lgColumn",
		transclude: true,
		link: function (scope, instanceElement, instanceAttrs, templateColumnController, linker) {
			instanceElement.remove();
			templateColumnController.registerHeaderTemplate(linker);
		}
	};
});