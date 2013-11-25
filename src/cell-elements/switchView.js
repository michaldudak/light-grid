/* global grid */

grid.module.directive("switchView", function () {
	"use strict";
	
	return {
		require: "^?lgRow",
		link: function (scope, elem, attrs, rowController) {
			var viewName = attrs.switchView;

			elem.on("click", function () {
				rowController.switchView(viewName);
				
				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
	};
});