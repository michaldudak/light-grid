/* global grid */

grid.module.directive("lgHeaderView", function () {
	"use strict";

	return {
		scope: {},
		restrict: "EA",
		require: "^?lgColumn",
		transclude: true,
		compile: function (templateElement, templateAttrs, linker) {
			return function (scope, instanceElement, instanceAttrs, templateColumnController) {
				instanceElement.remove();
				templateColumnController.registerHeaderTemplate(linker);
			};
		}
	};
});