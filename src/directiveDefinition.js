grid.module.directive("lightGrid", function () {
	"use strict";
	
	function link(scope, element, attrs, gridController) {
		"use strict";

		scope.$watchCollection("data", function () {
			gridController.redraw();
		});
	}
	
	return {
		scope: {
			data: "=?",
			extraSettings: "="
		},
		template: "<table class='angular-grid' ng-transclude></table>",
		replace: true,
		restrict: "EA",
		transclude: true,
		link: link,
		controller: grid.controller,
		controllerAs: "gridController",
		require: "lightGrid"
	};
});