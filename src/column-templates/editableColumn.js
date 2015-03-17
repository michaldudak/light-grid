/**
 * Simple editable column. Renders either a property value or a text input bound to a property,
 * depending on a view mode ("edit" for edit mode, any other for read-only mode)
 */
angular.module("light-grid").directive("lgEditableColumn", function () {
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