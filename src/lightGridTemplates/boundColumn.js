/**
 * Simple read-only column bound to a model's property
 */
angular.module("lightGridTemplates").directive("lgBoundColumn", function () {
	"use strict";

	var template = "<td>{{ row.data['{property}'] }}</td>";

	return {
		restrict: "EA",
		template: function(elem, attrs) {
			return template.replace("{property}", attrs.property);
		},
		replace: true
	};
});
