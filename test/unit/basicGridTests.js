/// <reference path="/libs/jquery.js" />
/// <reference path="/libs/angular.js" />
/// <reference path="/dist/light-grid-0.1.0.min.js" />
/// <reference path="/test/lib/angular-mocks.js" />

/* global beforeEach, describe, it, expect, inject, module, markup, spyOn */

describe("Grid directive tests:", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var gridService;

	var emptyGrid = "<light-grid id='testGrid' class='table'></light-grid>";
	var singleColumnGrid =
		"<light-grid id='testGrid' data='model'>" +
			"<lg-column title='\"Column 1\"'>{{rowData.id}}</lg-column>" +
		"</light-grid>";

	beforeEach(module("light-grid"));

	beforeEach(inject(function(_$compile_, _$rootScope_, _lgGridService_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		gridService = _lgGridService_;
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

	it("should register itself in the grid service", function() {
		spyOn(gridService, "registerGrid");
		
		$compile(singleColumnGrid)($rootScope);
		$rootScope.$digest();

		expect(gridService.registerGrid).toHaveBeenCalled();
		expect(gridService.registerGrid.calls.mostRecent().args[0]).toEqual("testGrid");
	});
	
	it("should unregister itself from the grid service after its scope is destroyed", function () {
		spyOn(gridService, "unregisterGrid");

		var scope = $rootScope.$new();

		$compile(singleColumnGrid)(scope);
		scope.$digest();
		scope.$destroy();

		expect(gridService.unregisterGrid).toHaveBeenCalledWith("testGrid");
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
});