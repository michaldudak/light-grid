grid.module.directive("boundColumn", function () {
	var template = "<template-column><template-view>{{rowData.[property]}}</template-view></template-column>";

	return {
		restrict: "EA",
		template: function(elem, attrs) {
			return template.replace("[property]", attrs.property);
		},
		replace: true
	};
});