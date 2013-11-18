/**
 * Represents a cell in a table.
 * Does not expose any API.
 *
 * @function cellDirective
 * @module lightGrid
 */
grid.module.directive("lgCell", ["$compile", function cellDirective($compile) {
	function countProperties(obj) {
		if (typeof Object.keys === "function") {
			return Object.keys(obj).length;
		}
		
		var count = 0;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				++count;
			}
		}

		return keys;
	}

	return {
		restrict: "EA",
		require: "^lightGrid",
		link: function(scope, element, attrs, gridController) {
			var views = scope.columnDefinition.views;

			var transclusionScope = scope;
			transclusionScope.external = gridController.getScope().$parent;
			
			element.attr("class", scope.columnDefinition.attributes.class);

			if (countProperties(views) === 1 && typeof(views["*"]) !== "undefined") {
				// optimization: if there is just default view defined, we don't need ngSwitch

				views["*"](transclusionScope, function (clone) {
					element.append(clone);
				});

				return;
			}

			var switchRoot = angular.element("<div ng-switch='view' />");

			for (var view in views) {
				if (views.hasOwnProperty(view) && view !== "*") {
					var viewLinker = views[view];
					var switchElement = angular.element("<div ng-switch-when='" + view + "' />");

					viewLinker(transclusionScope, function (clone) {
						switchElement.append(clone);
					});

					switchRoot.append(switchElement);
				}
			}

			if (views["*"]) {
				var defaultElement = angular.element("<div ng-switch-default />");
				views["*"](transclusionScope, function (clone) {
					defaultElement.append(clone);
				});

				switchRoot.append(defaultElement);
			}

			element.append(switchRoot);
			$compile(switchRoot)(transclusionScope);
		}
	};
}]);