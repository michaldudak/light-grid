grid.module.directive("headerRow", function headerRowDirective() {
	"use strict";

	function createHeaderCell(cellModel) {
		return $("<th>").append(cellModel);
	}

	return {
		restrict: "A",
		link: function (scope, element) {
			var row = element;

			scope.$watch("columnDefinitions", function(columnDefinitions) {

				if (columnDefinitions.length) {
					for (var col in columnDefinitions) {
						if (columnDefinitions.hasOwnProperty(col)) {
							var renderer = columnDefinitions[col].headerRenderer;
							row.append(createHeaderCell(renderer()));
						}
					}
				}
			});
		}
	};
});