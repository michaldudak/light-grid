/// <reference path="/libs/jquery.js" />
/// <reference path="/libs/angular.js" />
/// <reference path="/dist/light-grid-0.1.0.min.js" />
/// <reference path="/test/lib/angular-mocks.js" />

/* global beforeEach, describe, it, expect, inject, module */

describe("Light Grid: Sorter directive tests", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var gridMarkup =
		"<light-grid id='grid' data='model'>" +
			"<lg-column>" +
				"<lg-header-view><span lg-sorter sort-property='firstName'>First Name<span></lg-header-view>" +
				"<lg-view></lg-view>" +
			"</lg-column>" +
		"</light-grid>";

	var gridService;

	beforeEach(module("light-grid"));

	beforeEach(inject(function (_$compile_, _$rootScope_, _lgGridService_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		gridService = _lgGridService_;

		$rootScope.model = [
			{ firstName: "John", lastName: "Doe" },
			{ firstName: "Adam", lastName: "Smith" }
		];
	}));

	it("should render the directive properly", function () {
		var compiledGrid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();

		var sorter = compiledGrid.find("span[lg-sorter]");

		expect(sorter).toBeDefined();
		expect(sorter.length).toEqual(1);
		expect(sorter.hasClass("sorter")).toBeTruthy();
		expect(sorter.find(".columnTitle").length).toEqual(1);
	});

	it("should call the sort method of data provider when clicked", function() {
		var mockDataProvider = {
			sort: jasmine.createSpy("sort")
		};

		spyOn(gridService, "getDataProvider").and.returnValue(mockDataProvider);

		var compiledGrid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();

		var sorter = compiledGrid.find("span[lg-sorter]");
		sorter.trigger("click");
		$rootScope.$digest();

		expect(mockDataProvider.sort).toHaveBeenCalledWith("firstName", false);
	});

	it("should set a 'sorter-asc' CSS class when a corresponding column is sorted in ascending order", function() {
		var compiledGrid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();
		var sorter = compiledGrid.find("span[lg-sorter]");

		var viewOptions = {
			sortProperty: "firstName",
			sortDirectionDescending: false
		};

		$rootScope.$broadcast("lightGrid.dataUpdated", "grid", { viewOptions: viewOptions });
		
		expect(sorter.hasClass("sorter-asc")).toBeTruthy();
		expect(sorter.hasClass("sorter-desc")).toBeFalsy();
	});
	
	it("should set a 'sorter-desc' CSS class when a corresponding column is sorted in ascending order", function () {
		var compiledGrid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();
		var sorter = compiledGrid.find("span[lg-sorter]");

		var viewOptions = {
			sortProperty: "firstName",
			sortDirectionDescending: true
		};

		$rootScope.$broadcast("lightGrid.dataUpdated", "grid", { viewOptions: viewOptions });

		expect(sorter.hasClass("sorter-desc")).toBeTruthy();
		expect(sorter.hasClass("sorter-asc")).toBeFalsy();
	});
	
	it("should not have 'sorter-asc' or 'sorter-desc' CSS classes when another column in the grid is sorted", function () {
		var compiledGrid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();
		var sorter = compiledGrid.find("span[lg-sorter]");

		var viewOptions = {
			sortProperty: "lastName",
			sortDirectionDescending: true
		};

		$rootScope.$broadcast("lightGrid.dataUpdated", "grid", { viewOptions: viewOptions });

		expect(sorter.hasClass("sorter-desc")).toBeFalsy();
		expect(sorter.hasClass("sorter-asc")).toBeFalsy();
	});
	
	it("should not remove 'sorter-asc' CSS class when another grid is sorted by other column", function () {
		var compiledGrid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();
		var sorter = compiledGrid.find("span[lg-sorter]");

		var viewOptions = {
			sortProperty: "firstName",
			sortDirectionDescending: false
		};

		$rootScope.$broadcast("lightGrid.dataUpdated", "grid", { viewOptions: viewOptions });

		viewOptions.sortProperty = "lastName";
		$rootScope.$broadcast("lightGrid.dataUpdated", "another-grid", { viewOptions: viewOptions });

		expect(sorter.hasClass("sorter-asc")).toBeTruthy();
		expect(sorter.hasClass("sorter-desc")).toBeFalsy();
	});
});