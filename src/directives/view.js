/* global grid */

/**
 * Defines a view in the column template
 */
grid.module.directive("lgView", function () {
	"use strict";
	
	return {
		restrict: "EA",
		require: "^lgColumn",
		transclude: true,
		link: function (scope, element, attrs, templateColumnController, linker) {
			var view = attrs.lgView || attrs.view;
			
			templateColumnController.registerView(view, linker);
			element.remove();
		}
	};
});