grid.module.directive("staticColumn", function () {
	return {
		scope: {
			content: "=",
			title: "="
		},
		restrict: "EA",
		require: "^lightGrid",
		link: function (scope, element, attrs, gridController) {
			element.remove();
			gridController.defineColumn({
				cellRenderer: function () {
					return scope.content;
				},
				headerRenderer: function () {
					return scope.title;
				},
				footerRenderer: null
			});
		}
	};
});