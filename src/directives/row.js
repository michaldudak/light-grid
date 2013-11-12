grid.module.directive("row", ["$compile", function rowDirective($compile) {
	"use strict";

	var expandingRowMarkup = "<tr ng-if='expandedTemplate'><td colspan='{{columnDefinitions.length}}' ng-include='expandedTemplate'></td></tr>";

	return {
		restrict: "A",
		template: "<td cell ng-repeat='columnDefinition in columnDefinitions'></td>",
		replace: false,
		controller: ["$scope", function rowController($scope) {
			var self = this;
			
			$scope.expandedTemplate = null;

			this.openDetails = function (detailsTemplate) {
				$scope.expandedTemplate = detailsTemplate;
				console.log("Opening details on row " + $scope.$index);
			};

			this.closeDetails = function () {
				$scope.expandedTemplate = null;
				console.log("Closing details on row " + $scope.$index);
			};

			this.toggleDetails = function (detailsTemplate) {
				if ($scope.expandedTemplate === null) {
					self.openDetails(detailsTemplate);
				} else {
					self.closeDetails();
				}
			};

			this.switchView = function(viewName) {
				
				if ($scope.view === viewName) {
					return;
				}
				
				$scope.view = viewName;
				$scope.viewData = angular.copy($scope.rowData);
				console.log("Switching view on the row " + $scope.$index + " to " + viewName);
			};

			this.acceptDataChanges = function() {
				$.extend($scope.rowData, $scope.viewData);
			};
			
			this.getDomElement = function () {
				return $element;
			};

			$scope.$on("lightGrid.row.switchView", function(event, viewName) {
				self.switchView(viewName);
			});
		}],
		controllerAs: "rowController",
		link: function(scope, element) {

			if (element[0].nodeName !== "TR") {
				throw new Error("Row directive must be placed on a tr element.");
			}

			scope.$watch("rowData", function(rowData) {
				scope.viewData = angular.copy(rowData);
			});

			var expandingRow = $(expandingRowMarkup);
			expandingRow.data(element.data());
			$compile(expandingRow)(scope);

			element.after(expandingRow);
		}
	};
}]);