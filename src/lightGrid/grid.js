/**
 * The root grid directive.
 * Parameters:
 *  - model - {Array} (interpolated) data model displayed on the grid (optional).
 *  - initial-view - {String} Name of the initial view mode of all rows in the grid.
 */
angular.module("lightGrid").directive("lgGrid", function gridDirective() {
	"use strict";

	return {
		scope: true,
		controller: function lgGridController($scope, $attrs) {
			this.getModel = function getModel() {
				return $scope.grid.data;
			};
			
			this.getInitialView = function getInitialView() {
				return $attrs.initialView;
			};
			
			this.switchView = function switchView(viewName) {
				$scope.$parent.$broadcast("switchView:" + this.getIdentifier(), viewName);
			};
			
			this.getIdentifier = function getIedntifier() {
				return $scope.$$gridId;
			};
		},
		require: "lgGrid",
		link: {
			pre: function lgGridLink($scope, $elem, $attrs, gridController) {
				$scope.$$gridId = Math.floor(Math.random() * 1000000);
				
				$scope.grid = {
					data: $scope.$eval($attrs.model),
					controller: gridController
				};
				
				$scope.$watch($attrs.model, function (newValue, oldValue) {
					if (newValue !== oldValue) {
						$scope.grid.data = newValue;
					}
				});
				
				$elem.addClass("light-grid");
			}
		}
	};
});
