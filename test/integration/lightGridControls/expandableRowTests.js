/* global beforeEach, describe, fdescribe, it, expect, inject, module */

fdescribe("Expandable row", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var $timeout;

	var detailsTemplate =
		"<script type='text/ng-template' id='detailsTemplate'>" +
			"Details for row {{row.data.id}}" +
		"</script>";

	var grid =
		"<table lg-grid model='model'>" +
			"<tr>" +
				"<td>{{row.data.id}}</td>" +
				"<td><button lg-toggle-expanded-row>Details</button></td>" +
			"</tr>" +
			"<tr lg-expanded-row><td colspan='2'><ng-include src='\"detailsTemplate\"'></ng-include></td></tr>" +
		"</table>";

	beforeEach(function () {
		module("lightGrid");
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;

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
			$timeout.flush();
			$rootScope.$digest();
		});

		it("should create additional row", function() {
			expect(element.find("tbody tr:not(.ng-hide)").length).toEqual(4);
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
			expect(element.find("tbody tr:not(.ng-hide)").length).toEqual(5);
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

			expect(element.find("tbody tr:not(.ng-hide)").length).toEqual(3);
			expect(element.text()).not.toMatch("Details for row");
		});
	});
});
