(function (window, ng) {
	"use strict";
	
	window.angularGrid.module.directive("boundColumn", function () {
		return {
			scope: {
				property: "@",
				title: "="
			},
			restrict: "EA",
			require: "^grid",
			link: function(scope, element, attrs, gridController) {
				element.remove();
				gridController.defineColumn({
					cellRenderer: function(rowScope) {
						return rowScope.rowData[scope.property];
					},
					headerRenderer: function() {
						return scope.title;
					},
					footerRenderer: null
				});
			}
		};
	});

}(window, window.angular));