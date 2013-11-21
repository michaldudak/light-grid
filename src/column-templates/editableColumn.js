/* global grid */

grid.module.directive("lgEditableColumn", function () {
	"use strict";
	
	var template = "<lg-column><lg-view>{{rowData[\"{property}\"]}}</lg-view><lg-view view='edit'>" +
		"<input type='text' ng-model='viewData[\"{property}\"]' class='form-control input-sm' /></lg-view></lg-column>";

	return {
		restrict: "EA",
		template: function(elem, attrs) {
			return template.replace(/\{property\}/g, attrs.property);
		},
		replace: true
	};
});