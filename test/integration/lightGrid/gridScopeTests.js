/* global beforeEach, describe, it, expect, inject, module */

describe("Grid scope tests", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var grid =
		"<lg-grid model='model'>" +
			"<lg-column class='simpleColumn' title='titleValue'>{{ rowValue }}</lg-column>" +
			"<lg-column class='columnWithHeader'>" +
				"<lg-header-view>{{ titleValue }}</lg-header-view><span class='rootValue' ng-bind='rowValue'></span></lg-column>" +
			"</lg-column>" +
			"<lg-column class='columnWithView'>" +
				"<lg-view>{{ rowValue }}</lg-view></lg-column>" +
			"</lg-column>" +
		"</lg-grid>";

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

	describe("when the grid templates contain references to the outer scope", function() {
		var element;
		
		beforeEach(function () {
			element = $compile(grid)($rootScope);
			$rootScope.$digest();
		});
		
		it("should resolve the reference from a simple column", function() {
			expect(element.find("tr:eq(1) .simpleColumn").text()).toEqual($rootScope.rowValue);
			expect(element.find("tr:eq(2) .simpleColumn").text()).toEqual($rootScope.rowValue);
		});
		
		it("should resolve the reference from a header of a simple column", function() {
			expect(element.find("tr:eq(0) .simpleColumn").text()).toEqual($rootScope.titleValue);
		});
		
		it("should resolve the reference from a header view of a column", function() {
			expect(element.find("tr:eq(0) .columnWithHeader").text()).toEqual($rootScope.titleValue);
		});
		
		it("should resolve the reference from a simple column containing a header view", function() {
			expect(element.find("tr:eq(1) .columnWithHeader").text()).toEqual($rootScope.rowValue);
			expect(element.find("tr:eq(2) .columnWithHeader").text()).toEqual($rootScope.rowValue);
		});
		
		it("should resolve the reference from a column with a view", function() {
			expect(element.find("tr:eq(1) .columnWithView").text()).toEqual($rootScope.rowValue);
			expect(element.find("tr:eq(2) .columnWithView").text()).toEqual($rootScope.rowValue);
		});
	});
});