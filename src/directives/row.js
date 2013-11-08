grid.module.directive("row", ["$compile", function rowDirective($compile) {
	"use strict";

	function createCell(cellModel) {
		return $("<td>").append(cellModel);
	}

	var expandingRowMarkup = "<tr ng-if='expandedTemplate'><td colspan='{{columnCount}}' ng-include='expandedTemplate'></td></tr>";

	return {
		restrict: "A",
		controller: ["$scope", function($scope) {
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
				$scope.view = viewName;
				console.log("Switching view on a row " + $scope.$index + " to " + viewName);
			};
		}],
		controllerAs: "rowController",
		link: function(scope, element) {
			var columnDefinitions = scope.columnDefinitions;

			var row = element;
			if (columnDefinitions.length) {
				// full-featured mode
				for (var col in columnDefinitions) {
					if (columnDefinitions.hasOwnProperty(col)) {
						var renderer = columnDefinitions[col].cellRenderer;
						var cellContent = renderer(scope);
						row.append(createCell(cellContent));
					}
				}

				scope.columnCount = columnDefinitions.length;
			} else {
				// simple mode, without column definitions
				scope.columnCount = 0;
				for (var prop in scope.rowData) {
					if (scope.rowData.hasOwnProperty(prop)) {
						row.append(createCell(scope.rowData[prop]));
						scope.columnCount += 1;
					}
				}
			}

			var expandingRow = $(expandingRowMarkup);
			$compile(expandingRow)(scope);

			element.after(expandingRow);
		}
	};
}]);