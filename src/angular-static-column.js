(function (window, ng) {
	"use strict";

	window.angularGrid.directive("staticColumn", function () {
		return {
			scope: {
				content: "=",
				title: "="
			},
			restrict: "EA",
			require: "^grid",
			link: function (scope, element, attrs, gridController) {
				element.remove();
				gridController.defineColumn({
					cellRenderer: function (rowData, rowId) {
						return scope.content;
					},
					headerRenderer: function () {
						return scope.title;
					},
					footerRenderer: null
				});
			}
		};
	});

}(window, window.angular));