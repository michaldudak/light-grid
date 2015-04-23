/* global beforeEach, describe, it, expect, inject, module */

describe("Grid directive tests:", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var emptyGrid = "<light-grid id='testGrid' class='table'></light-grid>";
	var singleColumnGrid =
		"<light-grid id='testGrid' model='model'>" +
			"<lg-column title='\"Column 1\"'>{{rowData.id}}</lg-column>" +
		"</light-grid>";
	var gridOnTableTag =
		"<table light-grid id='testGrid' model='model'>" +
			"<tr lg-column-templates>" +
				"<td lg-column title='\"Column 1\"'>{{rowData.id}}</td>" +
			"</tr>" +
		"</table>";

	beforeEach(module("lightGrid"));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	it("should replace the directive with a table tag", function () {
		var element = $compile(emptyGrid)($rootScope);
		$rootScope.$digest();

		expect(element[0].nodeName).toEqual("TABLE");
		expect(element.children("thead").length).toEqual(1);
		expect(element.children("tbody").length).toEqual(1);
		expect(element.hasClass("light-grid")).toBeTruthy();
	});

	it("should append CSS classes specified on the directive to the resulting table", function() {
		var element = $compile(emptyGrid)($rootScope);
		$rootScope.$digest();

		expect(element.hasClass("table")).toBeTruthy();
	});

	it("should have column titles defined in the markup", function () {
		$rootScope.model = [];

		var element = $compile(singleColumnGrid)($rootScope);
		$rootScope.$digest();

		expect(element.find("th:eq(0)").text()).toEqual("Column 1");
	});

	describe("when array with 3 records is provided as a model", function() {
		var model = [{ id: 1 }, { id: 2 }, { id: 3 }];

		it("should render 3 rows", function () {
			$rootScope.model = model;

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();

			expect(element.find("tbody").children("tr").length).toEqual(3);
			expect(element.find("tbody").children("tr:eq(0)").text()).toEqual("1");
			expect(element.find("tbody").children("tr:eq(1)").text()).toEqual("2");
			expect(element.find("tbody").children("tr:eq(2)").text()).toEqual("3");
		});
	});

	describe("when array with 3 empty records is provided as a model", function () {
		var model = [{}, {}, {}];

		it("should render 3 rows", function () {
			$rootScope.model = model;

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();

			expect(element.find("tbody").children("tr").length).toEqual(3);
			expect(element.find("tbody").children("tr:eq(0)").text()).toEqual("");
			expect(element.find("tbody").children("tr:eq(1)").text()).toEqual("");
			expect(element.find("tbody").children("tr:eq(2)").text()).toEqual("");
		});
	});

	describe("when an empty array is provided as a model", function () {
		var model = [];

		it("should not render any rows", function () {
			$rootScope.model = model;

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();
			expect(element.find("tbody").children("tr").length).toEqual(0);
		});
	});

	describe("when an object with 3 keys is provided as a model", function () {
		var model = {
			foo1: { id: 1 },
			foo2: { id: 2 },
			foo3: { id: 3 }
		};

		it("should render 3 rows", function () {
			$rootScope.model = model;

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();

			expect(element.find("tbody").children("tr").length).toEqual(3);
			expect(element.find("tbody").children("tr:eq(0)").text()).toEqual("1");
			expect(element.find("tbody").children("tr:eq(1)").text()).toEqual("2");
			expect(element.find("tbody").children("tr:eq(2)").text()).toEqual("3");
		});
	});

	describe("when an empty object is provided as a model", function () {
		var model = {};

		it("should not render any rows", function () {
			$rootScope.model = model;

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();
			expect(element.find("tbody").children("tr").length).toEqual(0);
		});
	});

	describe("when a grid directive is used as an attribute", function () {
		it("should render as it was used as a custom element", function () {
			$rootScope.model = {
				foo1: { id: 1 },
				foo2: { id: 2 },
				foo3: { id: 3 }
			};

			var elementGrid = $compile(singleColumnGrid)($rootScope);
			var attributeGrid = $compile(gridOnTableTag)($rootScope);

			$rootScope.$digest();

			expect(attributeGrid.html()).toEqual(elementGrid.html());
		});
	});
});
