angular.module("lightGrid").directive("lgRow", function rowDirective($compile, DEFAULT_VIEW) {
	"use strict";
	
	function isInitialized(element) {
		if (element.length > 1) {
			return angular.isDefined(element.first().attr("lg-row-initialized"));
		} else {
			return angular.isDefined(element.attr("lg-row-initialized"));
		}
	}
	
	var repeaterExpression = "$$rowData in grid.data";
	
	return {
		multiElement: true,
		require: ["lgRow", "^lgGrid"],
		scope: true,
		controller: function lgRowController($scope) {
			var registeredViews = {};
			
			this.switchView = function (view) {
				$scope.row.view = view;
			};
			
			this.acceptViewModel = function () {
				angular.extend($scope.row.data, $scope.row.viewModel);
			};
			
			this.registerView = function (viewName) {
				registeredViews[viewName] = true;
			};
			
			this.isViewRegistered = function (viewName) {
				return !!registeredViews[viewName];
			};
		},
		link: {
			pre: function ($scope, $elem, $attrs, controllers) {
				var rowController = controllers[0];
				var gridController = controllers[1];
				
				$scope.row = {
					data: $scope.$$rowData,
					view: gridController.getInitialView() || DEFAULT_VIEW,
					viewModel: isInitialized($elem) ? angular.copy($scope.$$rowData) : {},
					controller: rowController
				};
			},
			post: function lgRowLink($scope, $elem, $attrs, controllers) {
				var rowController = controllers[0];
				var gridController = controllers[1];
				
				$scope.$on("switchView:" + gridController.getIdentifier(), function (e, viewName) {
					rowController.switchView(viewName);
				});
				
				if (isInitialized($elem)) {
					return;
				}
								
				if ($elem.length > 1) {
					var first = $elem.first();
					var last = $elem.last();
					first.attr("ng-repeat-start", repeaterExpression);
					first.attr("lg-row-initialized", "");
					last.attr("ng-repeat-end", "");
				} else {
					$elem.attr("ng-repeat", repeaterExpression);
					$elem.attr("lg-row-initialized", "");
				}
								
				$compile($elem)($scope);
			}
		}
	};
});