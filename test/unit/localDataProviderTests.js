/* global beforeEach, describe, it, expect, inject, module */

describe("Local data provider", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var dataProvider;

	var grid =
		"<light-grid id='testGrid' data-provider='dataProvider' model='dataProvider.getGridModel()'>" +
			"<lg-column title='\"Column 1\"'>{{rowData.id}}</lg-column>" +
		"</light-grid>";

	var gridWithoutDataProviderMarkup =
		"<light-grid id='testGrid' model='model'>" +
			"<lg-column title='\"Column 1\"'>{{rowData.id}}</lg-column>" +
		"</light-grid>";

	beforeEach(module("light-grid"));

	beforeEach(inject(function (_$compile_, _$rootScope_, _lgLocalDataProviderFactory_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.model = [
			{
				id: 1,
				firstName: "Frodo",
				lastName: "Baggins"
			},
			{
				id: 2,
				firstName: "Bilbo",
				lastName: "Baggins"
			},
			{
				id: 3,
				firstName: "Samwise",
				lastName: "Gamgee"
			},
			{
				id: 4,
				firstName: "Meriadok",
				lastName: "Brandybuck"
			}
		];

		dataProvider = _lgLocalDataProviderFactory_.create($rootScope.model);
		$rootScope.dataProvider = dataProvider;
	}));

	describe("#getGridModel", function () {
		it("should return the original model", function () {
			expect(dataProvider.getGridModel()).toEqual($rootScope.model);
		});
	});

	describe("#orderBy", function () {
		describe("when an order expression is provided", function () {
			it("should order the model by that expression ascending", function () {
				dataProvider.orderBy("firstName");
				var model = dataProvider.getGridModel();

				expect(model[0].firstName).toBe("Bilbo");
				expect(model[1].firstName).toBe("Frodo");
				expect(model[2].firstName).toBe("Meriadok");
				expect(model[3].firstName).toBe("Samwise");
			});
		});

		describe("when order expression is provided and reverse is set to false", function () {
			it("should order the model by that expression ascending", function () {
				dataProvider.orderBy("firstName", false);
				var model = dataProvider.getGridModel();

				expect(model[0].firstName).toBe("Bilbo");
				expect(model[1].firstName).toBe("Frodo");
				expect(model[2].firstName).toBe("Meriadok");
				expect(model[3].firstName).toBe("Samwise");
			});
		});

		describe("when order expression is provided and reverse is set to true", function () {
			it("should order the model by that expression descending", function () {
				dataProvider.orderBy("firstName", true);
				var model = dataProvider.getGridModel();

				expect(model[0].firstName).toBe("Samwise");
				expect(model[1].firstName).toBe("Meriadok");
				expect(model[2].firstName).toBe("Frodo");
				expect(model[3].firstName).toBe("Bilbo");
			});
		});

		describe("when nothing is passed to the function", function () {
			it("should return the original model", function () {
				dataProvider.orderBy();
				var model = dataProvider.getGridModel();

				expect(model[0].firstName).toBe("Frodo");
				expect(model[1].firstName).toBe("Bilbo");
				expect(model[2].firstName).toBe("Samwise");
				expect(model[3].firstName).toBe("Meriadok");
			});
		});
	});

	describe("when assigned to a given grid and having 4-element array as a model", function() {
		it("should replace the directive with a table tag", function () {
			var element = $compile(grid)($rootScope);
			$rootScope.$digest();

			expect(element[0].nodeName).toEqual("TABLE");
			expect(element.children("thead").length).toEqual(1);
			expect(element.children("tbody").length).toEqual(1);
			expect(element.hasClass("light-grid")).toBeTruthy();
		});

		it("should render four rows", function() {
			var element = $compile(grid)($rootScope);
			$rootScope.$digest();

			expect(element.find("tbody").children("tr").length).toEqual(4);
			expect(element.find("tbody").children("tr:eq(0)").text()).toEqual("1");
			expect(element.find("tbody").children("tr:eq(1)").text()).toEqual("2");
			expect(element.find("tbody").children("tr:eq(2)").text()).toEqual("3");
			expect(element.find("tbody").children("tr:eq(3)").text()).toEqual("4");
		});

		it("should render the data as if it was provided to grid's data property", function() {
			var expectedElement = $compile(gridWithoutDataProviderMarkup)($rootScope);
			var element = $compile(grid)($rootScope);
			$rootScope.$digest();

			expect(element.html()).toEqual(expectedElement.html());
		});
	});
});
