(function (window) {
	"use strict";

	window.angularGrid = window.angularGrid || {};
	var grid = window.angularGrid;

	grid.controller = function controllerFactory($scope, $element, $compile) {
		var controller = {};

		controller.defineColumn = function (column) {
			grid.columnDefinitions.push(column);
		};

		controller.redraw = function () {
			var tableElement = angularGrid.tableRenderer.renderTable($scope.data);
			var compiledTable = $compile(tableElement)($scope);
			$element.empty().append(compiledTable.children());
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