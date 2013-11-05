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

	function createRow(rowScope) {
		var rowId = rowScope.rowId;
		var rowData = rowScope.rowData;

		var row = $("<tr />");

		if (grid.columnDefinitions.length) {
			// full-featured mode
			for (var col in grid.columnDefinitions) {
				if (grid.columnDefinitions.hasOwnProperty(col)) {
					var renderer = grid.columnDefinitions[col].cellRenderer;
					var cellContent = renderer(rowScope);
					row.append(createCell(cellContent));
				}
			}
		} else {
			// simple mode, without column definitions
			for (var prop in rowData) {
				if (rowData.hasOwnProperty(prop)) {
					row.append(createCell(rowData[prop]));
				}
			}
		}

		if (typeof (rowId) !== "undefined") {
			row.data("id", rowId);
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

	function nopRenderer() {
		return "";
	}

	function createFooterRow() {
		var row = $("<tr />");

		if (grid.columnDefinitions.length) {
			for (var col in grid.columnDefinitions) {
				if (grid.columnDefinitions.hasOwnProperty(col)) {
					var renderer = grid.columnDefinitions[col].footerRenderer || nopRenderer;
					row.append(createFooterCell(renderer()));
				}
			}
		}

		return row;
	}

	function buildRow(gridScope, id, rows) {
		var rowScope = gridScope.$new();

		rowScope.rowId = id;
		rowScope.rowData = gridScope.data[id];
		
		rows.append(createRow(rowScope));

		var openedRow = grid.openedRows[id];
		if (typeof (openedRow) !== "undefined") {
			var detailsRow = $("<td />").attr("colspan", grid.columnDefinitions.length).append(openedRow);
			rows.append($("<tr />").append(detailsRow));
		}
	}

	function createTable(gridScope) {
		var tableModel = gridScope.data;
		var table = $("<table />");
		table.append(createHeaderRow());

		if ($.isArray(tableModel)) {
			// model is an array
			for (var i = 0; i < tableModel.length; ++i) {
				buildRow(gridScope, i, table);
			}
		} else {
			// model is a plain object
			for (var prop in tableModel) {
				if (tableModel.hasOwnProperty(prop)) {
					buildRow(gridScope, prop, table);
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