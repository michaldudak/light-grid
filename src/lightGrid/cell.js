/**
 * Represents a cell in a table.
 * Does not expose any API.
 *
 * @function cellDirective
 * @module lightGrid
 */
angular.module("lightGrid").directive("lgCell", ['$compile', 'DEFAULT_VIEW_NAME', function cellDirective($compile, DEFAULT_VIEW_NAME) {
	"use strict";

	var countProperties;

	if (typeof (Object.keys) === "function") {
		countProperties = function (obj) {
			return Object.keys(obj).length;
		};
	} else {
		countProperties = function (obj) {
			var count = 0;
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					++count;
				}
			}

			return count;
		};
	}

	return {
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

			if (countProperties(views) === 1 && !angular.isUndefined(views[DEFAULT_VIEW_NAME])) {
				// Optimization: if there is just default view defined, we don't need ngSwitch.
				// Instead we'll just wrap the original contents of the directive in a div.

				var singleView = views[DEFAULT_VIEW_NAME];
				var singleViewNode = angular.element("<div>").append(singleView);

				element.append(singleViewNode);
				$compile(singleViewNode)(transclusionScope);

				return;
			}

			var switchRoot = angular.element("<div ng-switch='view'>");

			for (var view in views) {
				if (views.hasOwnProperty(view) && view !== DEFAULT_VIEW_NAME) {
					// Processing all the views except the default one:
					// each view gets linked with the cell scope and wrapped in a ng-switch-when container
					// that shows it only when scope's view property matches the view name
					var viewHtml = views[view];
					var switchElement = angular.element("<div ng-switch-when='" + view + "' />");

					// View content is added to the container with a ng-switch attribute
					switchRoot.append(switchElement);
					switchElement.append(viewHtml);
				}
			}

			// The view identified by DEFAULT_VIEW_NAME is a special case - it defines the 'fallback'
			// view used if no other view matches.
			if (angular.isDefined(views[DEFAULT_VIEW_NAME])) {
				var defaultElement = angular.element("<div ng-switch-default />");
				switchRoot.append(defaultElement);
				defaultElement.append(views[DEFAULT_VIEW_NAME]);
			}

			element.append(switchRoot);

			// The whole container needs to be compiled to enable the ng-switch directive.
			$compile(switchRoot)(transclusionScope);
		}
	};
} ]);
