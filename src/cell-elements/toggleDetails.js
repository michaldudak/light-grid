grid.module.directive("toggleDetails", function() {
	return {
		require: "^?lgRow",
		link: function(scope, elem, attrs, rowController) {
			var detailsTemplate = attrs.toggleDetails || attrs.detailsTemplate;

			elem.on("click", function () {
				rowController.toggleDetails(detailsTemplate);
				
				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
	};
});