grid.module.directive("switchView", function () {
	return {
		link: function (scope, elem, attrs) {
			var viewName = attrs.switchView;

			elem.on("click", function () {
				scope.rowController.switchView(viewName);
				
				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
	};
});