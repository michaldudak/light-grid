grid.module.directive("switchView", function () {
	return {
		link: function (scope, elem, attrs) {
			var viewName = attrs.switchView;

			elem.on("click", function () {
				var rowId = scope.rowId;
				console.log("Switching view on a row " + rowId + " to " + viewName);

				scope.gridController.switchView(viewName, rowId);
				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
	};
});