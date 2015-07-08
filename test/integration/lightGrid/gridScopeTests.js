/* global beforeEach, describe, it, expect, inject, module */

describe("Grid scope tests", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var grid =
		"\
		<table lg-grid model='model'> \
			<tr> \
				<th>{{ titleValue }}</th> \
				<th>{{ grid.data.length }}</th> \
			</tr> \
			<tr lg-row> \
				<td class='simpleColumn'>{{ rowValue }}</td> \
				<td class='columnWithView'> \
					<lg-view>{{ rowValue }}</lg-view> \
				</td> \
				<td class='gridScopeRef'>{{ grid.data.length }}</td> \
			</tr> \
		</table>";

	beforeEach(function () {
		module("lightGrid");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$rootScope.titleValue = "Common column header text";
		$rootScope.rowValue = "Common cell text";

		$rootScope.model = [
			{ id: "one" },
			{ id: "two" }
		];
	}));
	
	var element;
		
	beforeEach(function () {
		element = $compile(grid)($rootScope);
		$rootScope.$digest();
	});

	describe("when the grid templates contain references to the outer scope", function() {
		it("should resolve the reference from a simple column", function() {
			expect(element.find("tr:eq(1) .simpleColumn").text().trim()).toEqual($rootScope.rowValue);
			expect(element.find("tr:eq(2) .simpleColumn").text().trim()).toEqual($rootScope.rowValue);
		});
		
		it("should resolve the reference from a header of a column", function() {
			expect(element.find("tr:eq(0) th:first").text().trim()).toEqual($rootScope.titleValue);
		});
		
		it("should resolve the reference from a column with a view", function() {
			expect(element.find("tr:eq(1) .columnWithView").text().trim()).toEqual($rootScope.rowValue);
			expect(element.find("tr:eq(2) .columnWithView").text().trim()).toEqual($rootScope.rowValue);
		});
	});
	
	describe("when the grid templates contain references to the grid scope", function() {
		it("should resolve the reference from a header of a column", function() {
			expect(element.find("tr:eq(0) th:last").text().trim()).toEqual("2");
		});
		
		it("should resolve the reference from a column", function() {
			expect(element.find("tr:eq(1) .gridScopeRef").text().trim()).toEqual("2");
			expect(element.find("tr:eq(2) .gridScopeRef").text().trim()).toEqual("2");
		});
	});
});