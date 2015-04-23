/**
 * Simple sortable column bound to a model's property
 */
angular.module("lightGridTemplates").directive("lgSortableColumn", function () {
	"use strict";

	var template = "<lg-column><lg-header-view><span lg-sorter sort-property='{property}' data-provider='{provider}'>{{ {title} }}</span></lg-header-view><lg-view>{{rowData['{property}']}}</lg-view></lg-column>";

	return {
		restrict: "EA",
		template: function (elem, attrs) {
			return template
				.replace(/\{property\}/g, attrs.property)
				.replace(/\{title\}/g, attrs.title)
				.replace(/\{provider}/g, attrs.provider);
		},
		replace: true
	};
});
