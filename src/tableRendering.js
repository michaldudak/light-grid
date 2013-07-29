(function(window, $) {
	"use strict";
	
	function createCell(cellModel) {
		return $("<td>").append(cellModel);
	}

	function createHeaderCell(cellModel) {
		return $("<th>").append(cellModel);
	}

	function createFooterCell(cellModel) {
		return createCell(cellModel);
	}

	function createRow(id, rowModel) {
		var row = $("<tr />");

		if (grid.columnDefinitions.length) {
			for (var col in grid.columnDefinitions) {
				if (grid.columnDefinitions.hasOwnProperty(col)) {
					var renderer = grid.columnDefinitions[col].cellRenderer;
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

		if (typeof (id) !== "undefined") {
			row.data("id", id);
		}

		return row;
	}

	function createHeaderRow() {
		var row = $("<tr />");

		if (grid.columnDefinitions.length) {
			for (var col in grid.columnDefinitions) {
				if (grid.columnDefinitions.hasOwnProperty(col)) {
					var renderer = grid.columnDefinitions[col].headerRenderer;
					row.append(createHeaderCell(renderer()));
				}
			}
		}

		return row;
	}


	function createFooterRow() {
		var row = $("<tr />");

		if (grid.columnDefinitions.length) {
			for (var col in grid.columnDefinitions) {
				if (grid.columnDefinitions.hasOwnProperty(col)) {
					var renderer = grid.columnDefinitions[col].footerRenderer || function () { return "" };
					row.append(createFooterCell(renderer()));
				}
			}
		}

		return row;
	}

	function buildRow(id, rowModel, rows) {
		rows.append(createRow(id, rowModel));

		var openedRow = grid.openedRows[id];
		if (typeof (openedRow) !== "undefined") {
			var detailsRow = $("<td />").attr("colspan", grid.columnDefinitions.length).append(openedRow);
			rows.append($("<tr />").append(detailsRow));
		}
	}

	function createTable(tableModel) {
		var table = $("<table />");
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

	window.angularGrid = window.angularGrid || {};
	var grid = window.angularGrid;

	window.angularGrid.columnDefinitions = [];
	window.angularGrid.openedRows = {};

	window.angularGrid.tableRenderer = {
		renderTable: createTable
	};

}(window, window.jQuery));