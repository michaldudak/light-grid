/**
 * Simple read-only column bound to a model's property
 */
angular.module("light-grid").directive("lgBoundColumn", function () {
	"use strict";
	
	var template = "<lg-column>{{rowData['{property}']}}</lg-column>";

	return {
		restrict: "EA",
		template: function(elem, attrs) {
			return template.replace("{property}", attrs.property);
		},
		replace: true
	};
});