/**
 * Represents a cell in a table.
 * Does not expose any API.
 *
 * @function cellDirective
 * @module lightGrid
 */
grid.module.directive("cell", ["$compile", function cellDirective($compile) {
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
		link: function(scope, element) {
			var views = scope.columnDefinition.views;

			if (countProperties(views) === 1 && typeof(views["*"]) !== "undefined") {
				// optimization: if there is just default view defined, we don't need ngSwitch

				views["*"](scope, function (clone) {
					element.append(clone);
				});

				return;
			}

			var switchRoot = angular.element("<div ng-switch='view' />");

			for (var availableView in views) {
				if (views.hasOwnProperty(availableView) && availableView !== "*") {
					var viewLinker = views[availableView];
					var switchElement = angular.element("<div ng-switch-when='" + availableView + "' />");

					viewLinker(scope, function(clone) {
						switchElement.append(clone);
					});

					switchRoot.append(switchElement);
				}
			}

			if (views["*"]) {
				var defaultElement = angular.element("<div ng-switch-default />");
				views["*"](scope, function(clone) {
					defaultElement.append(clone);
				});

				switchRoot.append(defaultElement);
			}

			element.append(switchRoot);
			$compile(switchRoot)(scope);
		}
	};
}]);