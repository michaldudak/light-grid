(function (window, ng) {
	"use strict";

	var angularGrid = ng.module("angular-grid", []);

	var trTemplate = "<tr data-id='{{{id}}}'>{{{item}}}</tr>";
	var tdTemplate = "<td>{{{item}}}</td>";
	
	function createCell(cellModel) {
		return tdTemplate.replace("{{{item}}}", cellModel);
	}

	function createRow(id, rowModel) {
		var cells = [];
		for (var prop in rowModel) {
			if (rowModel.hasOwnProperty(prop)) {
				cells.push(createCell(rowModel[prop]));
			}
		}

		var cellsMarkup = cells.join("");
		return trTemplate.replace("{{{item}}}", cellsMarkup).replace("{{{id}}}", id);
	}

	function createTable(tableModel) {
		var rows = [];
		var rowModel;

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

	angularGrid.directive("grid", function () {
		return {
			scope: {
				data: "="
			},
			template: "<table class='angular-grid'></table>",
			replace: true,
			restrict: "EA",
			link: link
	};
	});

}(window, window.angular));