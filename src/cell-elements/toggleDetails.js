grid.module.directive("toggleDetails", function() {
	return {
		require: "^lightGrid",
		link: function(scope, elem, attrs, gridController) {
			var detailsTemplate = attrs.detailsTemplate;

			elem.on("click", function () {
				var rowId = elem.closest("tr").data("id");
				console.log("Toggling row " + rowId);
			});
		}
	};
});