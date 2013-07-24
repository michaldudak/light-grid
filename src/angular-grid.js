(function (window, ng) {
	"use strict";

	var angularGrid = ng.module("angular-grid", []);
	window.angularGrid = angularGrid;

	var trTemplate = "<tr data-id='{{{id}}}'>{{{item}}}</tr>";
	var tdTemplate = "<td>{{{item}}}</td>";
	var thTemplate = "<th>{{{item}}}</th>";

	var columnDefinitions = [];
	
	function createCell(cellModel) {
		return tdTemplate.replace("{{{item}}}", cellModel);
	}
	
	function createHeaderCell(cellModel) {
		return thTemplate.replace("{{{item}}}", cellModel);
	}

	function createRow(id, rowModel) {
		var cells = [];

		if (columnDefinitions.length) {
			for (var col in columnDefinitions) {
				if (columnDefinitions.hasOwnProperty(col)) {
					var renderer = columnDefinitions[col].cellRenderer;
					cells.push(createCell(renderer(rowModel, id)));
				}
			}
		} else {
			for (var prop in rowModel) {
				if (rowModel.hasOwnProperty(prop)) {
					cells.push(createCell(rowModel[prop]));
				}
			}
		}

		var cellsMarkup = cells.join("");
		return trTemplate.replace("{{{item}}}", cellsMarkup).replace("{{{id}}}", id);
	}
	
	function createHeaderRow() {
		var cells = [];

		if (columnDefinitions.length) {
			for (var col in columnDefinitions) {
				if (columnDefinitions.hasOwnProperty(col)) {
					var renderer = columnDefinitions[col].headerRenderer;
					cells.push(createHeaderCell(renderer()));
				}
			}
		}
		
		var cellsMarkup = cells.join("");
		return trTemplate.replace("{{{item}}}", cellsMarkup);
	}

	function createTable(tableModel) {
		var rows = [];
		var rowModel;

		rows.push(createHeaderRow());

		if (Object.prototype.toString.call(tableModel) === "[object Array]") {
			// model is an array
			for (var i = 0; i < tableModel.length; ++i) {
				rowModel = tableModel[i];
				rows.push(createRow(i, rowModel));
			}
		} else {
			// model is a plain object
			for (var prop in tableModel) {
				if (tableModel.hasOwnProperty(prop)) {
					rowModel = tableModel[prop];
					rows.push(createRow(prop, rowModel));
				}
			}
		}

		return rows.join("");
	}
	
	function link(scope, element, attrs) {
		scope.$watchCollection("data", function(newValue) {
			element.html(createTable(newValue));
		});
	}

	function controller() {
		this.defineColumn = function(column) {
			columnDefinitions.push(column);
		};
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
			controller: controller
		};
	});

}(window, window.angular));