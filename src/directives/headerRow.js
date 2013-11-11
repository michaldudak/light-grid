grid.module.directive("headerRow", function headerRowDirective() {
	"use strict";

	return {
		restrict: "A",
		template: "<th header-cell ng-repeat='columnDefinition in columnDefinitions'></th>",
	};
});