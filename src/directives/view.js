/* global grid */

grid.module.directive("lgView", function () {
	"use strict";
	
	return {
		scope: {
			view: "@"
		},
		restrict: "EA",
		require: "^lgColumn",
		transclude: true,
		compile: function (templateElement, templateAttrs, linker) {
			return function (scope, instanceElement, instanceAttrs, templateColumnController) {
				instanceElement.remove();
				templateColumnController.registerView(scope.view, linker);
			};
		}
	};
});