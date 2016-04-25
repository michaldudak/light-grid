/**
 * Defines a view in the column template
 */
angular.module("lightGrid").directive("lgView", function ($compile) {
	"use strict";

	function isInitialized(element) {
		if (element.length > 1) {
			return angular.isDefined(element.first().attr("lg-view-initialized"));
		} else {
			return angular.isDefined(element.attr("lg-view-initialized"));
		}
	}

	return {
		multiElement: true,
		link: function lgViewLink($scope, $elem, $attrs) {
			if (isInitialized($elem)) {
				return;
			}

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

			if ($elem.length > 1) {
				var first = $elem.first();
				var last = $elem.last();

				first.attr("ng-if-start", displayCondition);
				first.attr("lg-view-initialized", "");
				last.attr("ng-if-end", "");
			} else {
				$elem.attr("lg-view-initialized", "");
				$elem.attr("ng-if", displayCondition);
			}

			$compile($elem)($scope);
		}
	};
});
