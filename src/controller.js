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

		controller.openDetails = function (rowId, content) {
			grid.openedRows[rowId] = content;
			controller.redraw();
		};

		controller.closeDetails = function (rowId) {
			delete grid.openedRows[rowId];
			controller.redraw();
		};
		
		$scope.gridController = controller;
		return controller;
	};

}(window));