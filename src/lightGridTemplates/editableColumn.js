/**
 * Simple editable column. Renders either a property value or a text input bound to a property,
 * depending on a view mode ("edit" for edit mode, any other for read-only mode)
 */
angular.module("lightGridTemplates").directive("lgEditableColumn", function () {
	"use strict";

	var template = "<td>" +
		"<lg-view>{{ row.data[\"{property}\"] }}</lg-view>" +
		"<lg-view view='edit'>" +
		"<input type='text' ng-model='row.data[\"{property}\"]' class='{inputClass}' />" +
		"</lg-view>" +
		"</td>";

	return {
		restrict: "EA",
		replace: true,
		template: function(elem, attrs) {
			return template
				.replace(/\{property\}/g, attrs.property || attrs.lgEditableColumn)
				.replace("{inputClass}", attrs.inputClass);
		}
	};
});
