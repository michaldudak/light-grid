/* global beforeEach, describe, it, expect, inject, module */

describe("Grid data rendering tests:", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var gridMarkup = "<table lg-grid model='model'><tr lg-row><td>{{ row.data.id }}</td></tr></table>";

	beforeEach(module("lightGrid"));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	describe("when array with 3 records is provided as a model", function() {
		var model = [{ id: 1 }, { id: 2 }, { id: 3 }];

		it("should render 3 rows", function () {
			$rootScope.model = model;

			var element = $compile(gridMarkup)($rootScope);
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

			var element = $compile(gridMarkup)($rootScope);
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

			var element = $compile(gridMarkup)($rootScope);
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

			var element = $compile(gridMarkup)($rootScope);
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

			var element = $compile(gridMarkup)($rootScope);
			$rootScope.$digest();
			expect(element.find("tbody").children("tr").length).toEqual(0);
		});
	});
});
