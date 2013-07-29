(function (window) {
	"use strict";

	window.angularGrid.directive("customColumn", function () {
		return {
			scope: {
				cellRenderer: "&",
				headerRenderer: "&",
				footerRenderer: "&"
			},
			restrict: "EA",
			require: "^grid",
			link: function (scope, element, attrs, gridController) {
				element.remove();
				gridController.defineColumn({
					cellRenderer: function (rowData, rowId) {
						return scope.cellRenderer({ rowData: rowData, rowId: rowId, gridController: gridController });
					},
					headerRenderer: function () {
						return scope.headerRenderer({ gridController: gridController });
					},
					footerRenderer: function () {
						return scope.footerRenderer({ gridController: gridController });
					}
				});
			}
		};
	});

}(window, window.angular));