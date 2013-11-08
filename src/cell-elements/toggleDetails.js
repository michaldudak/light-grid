grid.module.directive("toggleDetails", function() {
	return {
		link: function(scope, elem, attrs) {
			var detailsTemplate = attrs.toggleDetails || attrs.detailsTemplate;

			elem.on("click", function () {
				scope.rowController.toggleDetails(detailsTemplate);
				
				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
	};
});