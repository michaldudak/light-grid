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
		if (typeof Object.keys === "function") {
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

	return {
		restrict: "EA",
		require: "^lightGrid",
		link: function(scope, element, attrs, gridController) {
			var views = scope.columnDefinition.views;

			var transclusionScope = gridController.getScope().$parent.$new();

			transclusionScope.rowData = scope.rowData;
			transclusionScope.gridController = scope.gridController;
			transclusionScope.rowController = scope.rowController;

			scope.$watch("view", function() {
				transclusionScope.view = scope.view;
			});

			scope.$watch("viewData", function () {
				transclusionScope.viewData = scope.viewData;
			});
			
			element.attr("class", scope.columnDefinition.attributes.class);
			
			if (scope.columnDefinition.attributes.width) {
				element.width(scope.columnDefinition.attributes.width);
			}

			if (countProperties(views) === 1 && typeof(views["*"]) !== "undefined") {
				// optimization: if there is just default view defined, we don't need ngSwitch

				views["*"](transclusionScope, function (clone) {
					element.append(clone);
				});

				return;
			}

			var switchRoot = angular.element("<div ng-switch='view' />");
			
			function cloneLinkerHandlerBuilder(switchElem) {
				return function(clone) {
					switchElem.append(clone);
				};
			}

			for (var view in views) {
				if (views.hasOwnProperty(view) && view !== "*") {
					var viewLinker = views[view];
					var switchElement = angular.element("<div ng-switch-when='" + view + "' />");
					viewLinker(transclusionScope, cloneLinkerHandlerBuilder(switchElement));
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