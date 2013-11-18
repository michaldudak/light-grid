/// <reference path="/libs/jquery-1.10.2.js" />
/// <reference path="/libs/angular-1.2.0.js" />
/// <reference path="/dist/angular-grid-0.1.0.min.js" />
/// <reference path="/test/lib/angular-mocks.js" />

/* global beforeEach, describe, it, expect, inject, module */

describe("Grid directive tests:", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var emptyGrid = "<light-grid id='testGrid'></light-grid>";
	var singleColumnGrid = "<light-grid id='testGrid' data='model'><template-column title='\"Column 1\"'>{{rowData.id}}</template-column></light-grid>";
	
	beforeEach(module("light-grid"));
	
	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("should replace the directive with a table tag", function () {
		var element = $compile(emptyGrid)($rootScope);
		$rootScope.$digest();
		expect(element[0].nodeName).toEqual("TABLE");
		expect(element.children("thead").length).toEqual(1);
		expect(element.children("tbody").length).toEqual(1);
	});

	describe("when array with 3 records is provided as a model", function() {
		it("should render 3 rows", function () {
			$rootScope.model = [{ id: 1 }, { id: 2 }, { id: 3 }];
			
			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();
			expect(element.find("tbody").children("tr").length).toEqual(3);
		});
	});
	
	describe("when array with 3 empty records is provided as a model", function () {
		it("should render 3 rows", function () {
			$rootScope.model = [{}, {}, {}];

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();
			expect(element.find("tbody").children("tr").length).toEqual(3);
		});
	});
	
	describe("when an empty array is provided as a model", function () {
		it("should not render any rows", function () {
			$rootScope.model = [];

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();
			expect(element.find("tbody").children("tr").length).toEqual(0);
		});
	});
	
	describe("when an object with 3 keys is provided as a model", function () {
		it("should render 3 rows", function () {
			$rootScope.model = {
				foo1: { id: 1 },
				foo2: { id: 2 },
				foo3: { id: 3 }
			};

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();
			expect(element.find("tbody").children("tr").length).toEqual(3);
		});
	});
	
	describe("when an empty object is provided as a model", function () {
		it("should not render any rows", function () {
			$rootScope.model = {};

			var element = $compile(singleColumnGrid)($rootScope);
			$rootScope.$digest();
			expect(element.find("tbody").children("tr").length).toEqual(0);
		});
	});
});