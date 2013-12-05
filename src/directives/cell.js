/* global angular, grid */

/**
 * Represents a cell in a table.
 * Does not expose any API.
 *
 * @function cellDirective
 * @module lightGrid
 */
grid.module.directive("lgCell", ["$compile", function cellDirective($compile) {
	"use strict";
	
	function countProperties(obj) {
		if (typeof (Object.keys) === "function") {
			return Object.keys(obj).length;
		}
		
		var count = 0;
		for (var prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				++count;
			}
		}

		return count;
	}
	
	function cloneLinkerHandlerBuilder(switchElem) {
		return function (clone) {
			switchElem.append(clone);
		};
	}

	return {
		restrict: "EA",
		require: "^lgRow",
		link: function(scope, element, attrs, rowController) {
			var views = scope.columnDefinition.views;
			
			var transclusionScope = rowController.getCellScope();
			
			// CSS class defined on column template is copied to the rendered TD element...
			element.attr("class", scope.columnDefinition.attributes.class);
			
			// ...and so is the width attribute
			if (scope.columnDefinition.attributes.width) {
				element.css("width", scope.columnDefinition.attributes.width);
			}

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
					// processing all the views except the default one:
					// each view gets linked with the cell scope and wrapped in a ng-switch-when container
					// that shows it only when scope's view property matches the view name
					var viewLinker = views[view];
					var switchElement = angular.element("<div ng-switch-when='" + view + "' />");

					// compiled and linked view content is placed inside a switchElement container...
					viewLinker(transclusionScope, cloneLinkerHandlerBuilder(switchElement));

					// ...and added to the container with a ng-switch attribute
					switchRoot.append(switchElement);
				}
			}

			// The '*' view is a special case - it defines the 'fallback' view used if no other view matches
			if (views["*"]) {
				var defaultElement = angular.element("<div ng-switch-default />");
				views["*"](transclusionScope, function (clone) {
					// this view is placed inside a ng-switch-default directive which covers this case
					defaultElement.append(clone);
				});

				switchRoot.append(defaultElement);
			}

			element.append(switchRoot);
			
			// the whole container needs to be compiled to enable the ng-switch directive
			$compile(switchRoot)(transclusionScope);
		}
	};
}]);