/**
 * Represents a cell in a table.
 * Does not expose any API.
 *
 * @function cellDirective
 * @module lightGrid
 */
angular.module("lightGrid").directive("lgCell", function cellDirective($compile) {
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

	return {
		restrict: "EA",
		require: "^lgRow",
		link: function cellLink(scope, element, attrs, rowController) {
			var views = scope.columnDefinition.views;

			var transclusionScope = rowController.getCellScope();

			// CSS class defined on column template is copied to the rendered TD element...
			element.addClass(scope.columnDefinition.attributes.class);

			// ...and so is the width attribute
			if (scope.columnDefinition.attributes.width) {
				element.css("width", scope.columnDefinition.attributes.width);
			}

			if (countProperties(views) === 1 && typeof views["*"] !== "undefined") {
				// Optimization: if there is just default view defined, we don't need ngSwitch

				var onlyView = views["*"];

				if (typeof onlyView === "function") {
					onlyView(transclusionScope, function(transcludedClone) {
						element.append(transcludedClone);
					});
				} else {
					var onlyViewNode = angular.element("<div>" + onlyView + "</div>");
					element.append(onlyViewNode);
					$compile(onlyViewNode)(transclusionScope);
				}

				return;
			}

			var switchRoot = angular.element("<div ng-switch='view' />");
			var cases = [];

			for (var view in views) {
				if (views.hasOwnProperty(view) && view !== "*") {
					// Processing all the views except the default one:
					// each view gets linked with the cell scope and wrapped in a ng-switch-when container
					// that shows it only when scope's view property matches the view name
					var viewDefinition = views[view];
					var switchElement = angular.element("<div ng-switch-when='" + view + "' />");

					// View content is added to the container with a ng-switch attribute
					switchRoot.append(switchElement);

					cases.push({ node: switchElement, content: viewDefinition });
				}
			}

			// The '*' view is a special case - it defines the 'fallback' view used if no other view matches.
			if (views["*"]) {
				var defaultElement = angular.element("<div ng-switch-default />");
				switchRoot.append(defaultElement);
				cases.push({ node: defaultElement, content: views["*"] });
			}

			cases.forEach(function(caseElement) {
				if (typeof (caseElement.content) === "function") {
					var linker = caseElement.content;
					linker(transclusionScope, function (c) {
						caseElement.node.append(c);
					});
				} else {
					var clone = caseElement.content;
					caseElement.node.append(clone);
				}
			});

			element.append(switchRoot);

			// The whole container needs to be compiled to enable the ng-switch directive.
			$compile(switchRoot)(transclusionScope);
		}
	};
});
