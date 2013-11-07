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

	if (rowScope.columnDefinitions.length) {
		// full-featured mode
		for (var col in rowScope.columnDefinitions) {
			if (rowScope.columnDefinitions.hasOwnProperty(col)) {
				var renderer = rowScope.columnDefinitions[col].cellRenderer;
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

function createHeaderRow(gridScope) {
	var row = $("<tr />");

	if (gridScope.columnDefinitions.length) {
		for (var col in gridScope.columnDefinitions) {
			if (gridScope.columnDefinitions.hasOwnProperty(col)) {
				var renderer = gridScope.columnDefinitions[col].headerRenderer;
				row.append(createHeaderCell(renderer()));
			}
		}
	}

	return row;
}

function nopRenderer() {
	return "";
}

function createFooterRow(gridScope) {
	var row = $("<tr />");

	if (gridScope.columnDefinitions.length) {
		for (var col in gridScope.columnDefinitions) {
			if (gridScope.columnDefinitions.hasOwnProperty(col)) {
				var renderer = gridScope.columnDefinitions[col].footerRenderer || nopRenderer;
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

	gridScope.rowScopes[id] = rowScope;

	rows.append(createRow(rowScope));
}

function createTable(gridScope) {
	var tableModel = gridScope.data;
	var table = $("<table />");
	table.append(createHeaderRow(gridScope));
		
	if (gridScope.rowScopes) {
		for (var rowId in rowScopes) {
			if (rowScopes.hasOwnProperty(rowId)) {
				rowScopes[rowId].$destroy();
			}
		}
	}

	gridScope.rowScopes = {};

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

	table.append(createFooterRow(gridScope));

	return table;
}

	
grid.tableRenderer = {
	renderTable: createTable
};