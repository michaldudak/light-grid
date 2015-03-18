/* global beforeEach, describe, it, expect, inject, module */

describe("Expandable row", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var gridService;

	var detailsTemplate =
		"<script type='text/ng-template' id='detailsTemplate'>" +
			"Details for row {{rowData.id}}" +
		"</script>";

	var grid =
		"<light-grid id='testGrid'>" +
			"<lg-local-data-provider model='model'></lg-local-data-provider>" +
			"<lg-column>{{rowData.id}}</lg-column>" +
			"<lg-column><button data-lg-toggle-expanded-row='detailsTemplate'>Details</button></lg-column>" +
		"</light-grid>";
	
	beforeEach(module("light-grid"));

	beforeEach(inject(function (_$compile_, _$rootScope_, _lgGridService_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		gridService = _lgGridService_;

		$rootScope.model = [
			{ id: "one" },
			{ id: "two" },
			{ id: "three" }
		];
	}));

	describe("when the first toggle button is clicked once", function() {
		var element;

		beforeEach(function() {
			$compile(detailsTemplate)($rootScope);
			element = $compile(grid)($rootScope);
			$rootScope.$digest();

			var button = element.find("button").eq(0);
			button.click();
		});

		it("should create additional row", function() {
			expect(element.find("tbody tr").length).toEqual(4);
		});

		it("should create one column with colspan=2 in the additional row", function () {
			expect(element.find("tbody tr:eq(1) td").length).toEqual(1);
			expect(element.find("tbody tr:eq(1) td").attr("colspan")).toEqual("2");
		});

		it("should place the template content inside the new row", function () {
			expect(element.find("tbody tr:eq(1) td").text()).toEqual("Details for row one");
		});

		it("should open the template content inside the new row", function () {
			expect(element.find("tbody tr:eq(1) td").text()).toEqual("Details for row one");
		});
	});

	describe("when two toggle buttons are clicked once", function() {
		var element;

		beforeEach(function () {
			$compile(detailsTemplate)($rootScope);
			element = $compile(grid)($rootScope);
			$rootScope.$digest();

			var firstButton = element.find("button").eq(0);
			firstButton.click();

			var thirdButton = element.find("button").eq(2);
			thirdButton.click();
		});

		it("should create two additional rows", function() {
			expect(element.find("tbody tr").length).toEqual(5);
		});

		it("should open the template content inside the new rows", function () {
			expect(element.find("tbody tr:eq(1) td").text()).toEqual("Details for row one");
			expect(element.find("tbody tr:eq(4) td").text()).toEqual("Details for row three");
			expect(element.text()).not.toMatch("Details for row two");
		});
	});

	describe("when the first toggle button is clicked twice", function() {
		it("should delete the additional row", function () {
			$compile(detailsTemplate)($rootScope);
			var element = $compile(grid)($rootScope);
			$rootScope.$digest();

			var button = element.find("button").eq(0);
			button.click();
			button.click();

			expect(element.find("tbody tr").length).toEqual(3);
			expect(element.text()).not.toMatch("Details for row");
		});
	});
});