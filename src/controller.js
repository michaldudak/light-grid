(function (window) {
	"use strict";

	window.angularGrid = window.angularGrid || {};
	var grid = window.angularGrid;

	grid.controller = function controllerFactory($scope, $element) {
		var controller = {};
		var dataProviderController = null;

		controller.getData = function getData() {
			return $scope.data;
		};

		controller.setData = function setData(newData) {
			$scope.data = newData;
		};

		controller.defineColumn = function (column) {
			grid.columnDefinitions.push(column);
		};

		controller.redraw = function () {
			console.log("Redrawing table");
			var tableElement = grid.tableRenderer.renderTable($scope);
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

		controller.registerDataProvider = function(dataProvider) {
			dataProviderController = dataProvider;
		};
		
		$scope.gridController = controller;
		return controller;
	};
	
}(window));