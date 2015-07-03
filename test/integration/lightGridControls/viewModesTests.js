/* global beforeEach, describe, it, expect, inject, module */

describe("Light Grid: View modes tests", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var gridMarkup = "<lg-grid id='grid' model='model'><lg-column>" +
		"<lg-view>Default view</lg-view>" +
		"<lg-view view='alternate'>Alternate view</lg-view>" +
		"</lg-column></lg-grid>";

	var gridWithAlternateViewMarkup = "<lg-grid id='grid' model='model' initial-view='alternate'><lg-column>" +
		"<lg-view>Default view</lg-view>" +
		"<lg-view view='alternate'>Alternate view</lg-view>" +
		"</lg-column></lg-grid>";

	var gridWithMultiviewsMarkup = "<lg-grid id='grid' model='model'><lg-column>" +
		"<lg-view>Default view</lg-view>" +
		"<lg-view view='alternate1, alternate2'>Alternate view</lg-view>" +
		"</lg-column></lg-grid>";

	beforeEach(function () {
		module("lightGrid");
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.model = [
			{ firstName: "John", lastName: "Doe" },
			{ firstName: "Adam", lastName: "Smith" }
		];
	}));

	describe("when initial-view attribute is not set", function () {
		it("should initially render the default view", function () {
			var element = $compile(gridMarkup)($rootScope);
			$rootScope.$digest();
			var cell = element.find("td:first");
	
			expect(cell.text()).toBe("Default view");
			expect(element.html()).not.toMatch("Alternate view");
		});
	});

	describe("when initial-view attribute is set", function () {
		it("should initially render the view specified in initial-view attribute", function () {
			var element = $compile(gridWithAlternateViewMarkup)($rootScope);
			$rootScope.$digest();
			var cell = element.find("td:first");
	
			expect(cell.text()).toBe("Alternate view");
			expect(element.html()).not.toMatch("Default view");
		});
	});
	
	describe("when switchView is called", function () {
		describe("on a row, with a known view name", function () {
			it("should change the view of a row", function () {
				var element = $compile(gridMarkup)($rootScope);
				$rootScope.$digest();
		
				var firstRow = element.find("tbody tr").eq(0);
				var secondRow = element.find("tbody tr").eq(1);
		
				var rowController = firstRow.scope().rowController;
				rowController.switchView("alternate");
				$rootScope.$digest();
		
				expect(firstRow.find("td").text()).toBe("Alternate view");
				expect(secondRow.find("td").text()).toBe("Default view");
			});
		});
		
		describe("on a row, with unknown view name", function () {
			it("should show the default view", function () {
				var element = $compile(gridWithAlternateViewMarkup)($rootScope);
				$rootScope.$digest();
		
				var firstRow = element.find("tbody tr").eq(0);
				var secondRow = element.find("tbody tr").eq(1);
		
				var rowController = firstRow.scope().rowController;
				rowController.switchView("unknown");
				$rootScope.$digest();
		
				expect(firstRow.find("td").text()).toBe("Default view");
				expect(secondRow.find("td").text()).toBe("Alternate view");
			});
		});
		
		describe("on a grid", function () {
			it("should change the view of all rows when grid's switchView is called", function () {
				var element = $compile(gridMarkup)($rootScope);
				$rootScope.$digest();
		
				var firstRow = element.find("tbody tr").eq(0);
				var secondRow = element.find("tbody tr").eq(1);
		
				var gridController = firstRow.scope().gridController;
				gridController.switchView("alternate");
				$rootScope.$digest();
		
				expect(firstRow.find("td").text()).toBe("Alternate view");
				expect(secondRow.find("td").text()).toBe("Alternate view");
			});
		});
		
		describe("when a view is declared as multiview", function () {
			it("should show the proper view", function () {
				var element = $compile(gridWithMultiviewsMarkup)($rootScope);
				$rootScope.$digest();
		
				var firstRow = element.find("tbody tr").eq(0);
				var secondRow = element.find("tbody tr").eq(1);
		
				var firstRowController = firstRow.scope().rowController;
				var secondRowController = secondRow.scope().rowController;
		
				firstRowController.switchView("alternate1");
				secondRowController.switchView("alternate2");
				$rootScope.$digest();
		
				expect(firstRow.find("td").text()).toBe("Alternate view");
				expect(secondRow.find("td").text()).toBe("Alternate view");
			});
		});
	});
});
