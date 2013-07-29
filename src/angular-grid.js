/*

Angular Grid
  by Digital Creations

Currently supported properties in column definitions:
- cellRenderer(rowData, rowId)
- headerRenderer()
- planned: footerRenderer()

*/

(function (window, ng, $) {
	"use strict";

	var angularGrid = ng.module("angular-grid", []);
	window.angularGrid = angularGrid;

	var columnDefinitions = [];
	var openedRows = {};

	function createCell(cellModel) {
		return ng.element("<td>").append(cellModel);
	}
	
	function createHeaderCell(cellModel) {
		return ng.element("<th>").append(cellModel);
	}
	
	function createFooterCell(cellModel) {
		return createCell(cellModel);
	}

	function createRow(id, rowModel) {
		var row = ng.element("<tr />");

		if (columnDefinitions.length) {
			for (var col in columnDefinitions) {
				if (columnDefinitions.hasOwnProperty(col)) {
					var renderer = columnDefinitions[col].cellRenderer;
					row.append(createCell(renderer(rowModel, id)));
				}
			}
		} else {
			for (var prop in rowModel) {
				if (rowModel.hasOwnProperty(prop)) {
					row.append(createCell(rowModel[prop]));
				}
			}
		}

		if (typeof(id) !== "undefined") {
			row.data("id", id);
		}

		return row;
	}
	
	function createHeaderRow() {
		var row = ng.element("<tr />");

		if (columnDefinitions.length) {
			for (var col in columnDefinitions) {
				if (columnDefinitions.hasOwnProperty(col)) {
					var renderer = columnDefinitions[col].headerRenderer;
					row.append(createHeaderCell(renderer()));
				}
			}
		}

		return row;
	}
	

	function createFooterRow() {
		var row = ng.element("<tr />");

		if (columnDefinitions.length) {
			for (var col in columnDefinitions) {
				if (columnDefinitions.hasOwnProperty(col)) {
					var renderer = columnDefinitions[col].footerRenderer || function() { return "" };
					row.append(createFooterCell(renderer()));
				}
			}
		}

		return row;
	}
	
	function buildRow(id, rowModel, rows) {
		rows.append(createRow(id, rowModel));

		var openedRow = openedRows[id];
		if (typeof (openedRow) !== "undefined") {
			var detailsRow = ng.element("<td />").attr("colspan", columnDefinitions.length).append(openedRow)
			rows.append($("<tr />").append(detailsRow));
		}
	}

	function createTable(tableModel) {
		var table = ng.element("<table />");
		table.append(createHeaderRow());

		if ($.isArray(tableModel)) {
			// model is an array
			for (var i = 0; i < tableModel.length; ++i) {
				buildRow(i, tableModel[i], table);
			}
		} else {
			// model is a plain object
			for (var prop in tableModel) {
				if (tableModel.hasOwnProperty(prop)) {
					buildRow(prop, tableModel[prop], table);
				}
			}
		}

		table.append(createFooterRow());

		return table;
	}
	
	function link(scope, element, attrs, gridController) {
		scope.$watchCollection("data", function(newValue) {
			gridController.redraw();
		});
	}

	function controller($scope, $element, $compile) {
		var ctrl = {};

		ctrl.defineColumn = function (column) {
			columnDefinitions.push(column);
		};

		ctrl.redraw = function () {
			var tableElement = createTable($scope.data);
			var compiledTable = $compile(tableElement)($scope);
			$element.html("").append(compiledTable.children());
		};

		ctrl.openDetails = function(rowId, content) {
			openedRows[rowId] = content;
			ctrl.redraw();
		};

		ctrl.closeDetails = function(rowId) {
			delete openedRows[rowId];
			ctrl.redraw();
		};

		$scope.gridController = ctrl;
		

		$scope.sayHello = function() {
			alert("hello");
		};

		return ctrl;
	}

	angularGrid.directive("grid", function () {
		return {
			scope: {
				data: "="
			},
			template: "<table class='angular-grid' ng-transclude></table>",
			replace: true,
			restrict: "EA",
			transclude: true,
			link: link,
			controller: controller,
			require: "grid"
		};
	});

}(window, window.angular, window.jQuery));