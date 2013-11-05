(function (window) {
	"use strict";

	window.angularGrid = window.angularGrid || {};
	var grid = window.angularGrid;

	grid.controller = function controllerFactory($scope, $element) {
		var controller = {};

		controller.defineColumn = function (column) {
			grid.columnDefinitions.push(column);
		};

		controller.redraw = function () {
			console.log("Redrawing table");
			var tableElement = angularGrid.tableRenderer.renderTable($scope);
			$element.empty().append(tableElement.children());
		};

		controller.openDetails = function openDetails(rowId, content) {
			grid.openedRows[rowId] = content;
			controller.redraw();
		};

		controller.closeDetails = function closeDetails(rowId) {
			delete grid.openedRows[rowId];
			controller.redraw();
		};

		controller.toggleDetails = function toggleDetails(rowId, content) {
			if (typeof(grid.openedRows[rowId]) === "undefined") {
				controller.openDetails(rowId, content);
			} else {
				controller.closeDetails(rowId);
			}
		};
		
		$scope.gridController = controller;
		return controller;
	};

}(window));