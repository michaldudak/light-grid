/* global grid */

/**
 * Defines a view in the column template
 */
grid.module.directive("lgView", function () {
	"use strict";
	
	return {
		restrict: "EA",
		require: "^lgColumn",
		compile: function(tElement, tAttrs) {
			var innerHtml = tElement.html();
			
			// we don't want to compile the contents of the view at this point
			// it'll be done later, in cell directive
			tElement.empty();

			return function(scope, element, attrs, templateColumnController) {
				var view = tAttrs.lgView || tAttrs.view;
				templateColumnController.registerView(view, innerHtml);
				element.remove();
			};
		}
	};
});