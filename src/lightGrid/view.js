/**
 * Defines a view in the column template
 */
angular.module("lightGrid").directive("lgView", function () {
	"use strict";

	return {
		transclude: "element",
		priority: 600, // as ngIf
		link: function lgViewLink($scope, $elem, $attrs, ctrl, $transclude) {
			var viewNameExpression = $attrs.lgView || $attrs.view;
			var viewNames;

			if (!viewNameExpression) {
				viewNames = [];
			} else {
				viewNames = viewNameExpression.split(",").map(function (viewName) {
					return viewName.trim();
				});
			}

			viewNames.forEach(function (viewName) {
				$scope.row.controller.registerView(viewName);
			});

			$scope.shouldShowDefaultView = function (requestedViewName) {
				return !$scope.row.controller.isViewRegistered(requestedViewName);
			};

			var displayCondition;

			if (viewNames.length === 0) {
				displayCondition = "shouldShowDefaultView(row.view)";
			} else {
				displayCondition = viewNames.map(function (viewName) {
					return "row.view === '" + viewName + "'";
				}).join(" || ");
			}

			var placeholder = document.createComment("lgView");
			$elem.after(placeholder);

			var showing = false;
			var content = null;

			$scope.$watch(displayCondition, function lgViewWatchAction(shouldShow) {
				if (shouldShow && !showing) {
					$transclude(function (clone) {
						var $placeholder = angular.element(placeholder);
						$placeholder.parent()[0].insertBefore(clone[0], $placeholder[0]);
						content = clone;
					});
					showing = true;
				} else if (!shouldShow && showing) {
					content.remove();
					content = null;
					showing = false;
				}
			});
		}
	};
});
