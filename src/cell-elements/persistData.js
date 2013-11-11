grid.module.directive("persistData", function() {
	return {
		priority: 10,
		require: "^?row",
		link: function (scope, elem, attrs, rowController) {
			elem.on("click", function () {
				rowController.acceptDataChanges();

				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
	};
});