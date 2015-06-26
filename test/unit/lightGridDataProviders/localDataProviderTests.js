/* global beforeEach, describe, it, expect, inject, module */

describe("Local data provider", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var dataProvider;

	var grid =
		"<lg-grid id='testGrid' data-provider='dataProvider' model='dataProvider.getGridModel()'>" +
			"<lg-column title='\"Column 1\"'>{{rowData.id}}</lg-column>" +
		"</lg-grid>";

	var gridWithoutDataProviderMarkup =
		"<lg-grid id='testGrid' model='model'>" +
			"<lg-column title='\"Column 1\"'>{{rowData.id}}</lg-column>" +
		"</lg-grid>";

	beforeEach(function () {
		module("lightGrid");
		module("lightGridControls");
		module("lightGridDataProviders");
	});

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

	describe("#limitTo", function() {
		describe("when no parameters are set", function() {
			it("should return the whole dataset", function() {
				dataProvider.limitTo();
				var gridModel = dataProvider.getGridModel();
				expect(gridModel.length).toEqual(4);
			});
		});

		describe("when page size is larger than dataset length", function() {
			it("should return the whole dataset", function() {
				dataProvider.limitTo(10);
				var gridModel = dataProvider.getGridModel();
				expect(gridModel.length).toEqual(4);
			});
		});

		describe("when page size is equal to than dataset length", function () {
			it("should return the whole dataset", function () {
				dataProvider.limitTo(4);
				var gridModel = dataProvider.getGridModel();
				expect(gridModel.length).toEqual(4);
			});
		});

		describe("when page size is smaller (2) than dataset length", function () {
			describe("and 'begin' parameter is not set", function() {
				it("should return just the first items of the dataset", function() {
					dataProvider.limitTo(2);
					var gridModel = dataProvider.getGridModel();
					expect(gridModel.length).toEqual(2);
					expect(gridModel[0].firstName).toBe("Frodo");
					expect(gridModel[1].firstName).toBe("Bilbo");
				});
			});

			describe("and 'begin' parameter is set to 0", function () {
				it("should return just the first items of the dataset", function () {
					dataProvider.limitTo(2, 0);
					var gridModel = dataProvider.getGridModel();
					expect(gridModel.length).toEqual(2);
					expect(gridModel[0].firstName).toBe("Frodo");
					expect(gridModel[1].firstName).toBe("Bilbo");
				});
			});

			describe("and 'begin' parameter is set to 1", function () {
				it("should return just the second and third item of the dataset", function () {
					dataProvider.limitTo(2, 1);
					var gridModel = dataProvider.getGridModel();
					expect(gridModel.length).toEqual(2);
					expect(gridModel[0].firstName).toBe("Bilbo");
					expect(gridModel[1].firstName).toBe("Samwise");
				});
			});

			describe("and 'begin' parameter is 1 less than dataset length", function () {
				it("should return just the last item of the dataset", function () {
					dataProvider.limitTo(2, 3);
					var gridModel = dataProvider.getGridModel();
					expect(gridModel.length).toEqual(1);
					expect(gridModel[0].firstName).toBe("Meriadok");
				});
			});

			describe("and 'begin' parameter is larger than dataset length", function () {
				it("should reset to 'begin' parameter to 0", function () {
					dataProvider.limitTo(2, 10);
					expect(dataProvider.getCurrentViewSettings().limitTo.begin).toEqual(0);
				});

				it("should return the first items from the dataset", function () {
					dataProvider.limitTo(2, 10);
					var gridModel = dataProvider.getGridModel();
					expect(gridModel.length).toEqual(2);
					expect(gridModel[0].firstName).toBe("Frodo");
					expect(gridModel[1].firstName).toBe("Bilbo");
				});
			});
		});

		describe("when page size is set to zero", function () {
			it("should return the whole dataset", function () {
				dataProvider.limitTo(0);
				var gridModel = dataProvider.getGridModel();
				expect(gridModel.length).toEqual(4);
			});
		});
	});

	describe("#filter", function () {
		describe("when no parameters are passed", function () {
			it("should return the full dataset", function () {
				dataProvider.filter();
				var model = dataProvider.getGridModel();
				expect(model.length).toBe(4);
			});
		});

		describe("when expression parameter is passed", function () {
			it("should return the filtered dataset", function () {
				dataProvider.filter("Baggins");
				var model = dataProvider.getGridModel();
				expect(model.length).toBe(2);
				expect(model[0].firstName).toBe("Frodo");
				expect(model[1].firstName).toBe("Bilbo");
			});
		});
	});

	describe("when assigned to a given grid and having 4-element array as a model", function() {
		it("should render the data as if it was provided to grid's data property", function() {
			var expectedElement = $compile(gridWithoutDataProviderMarkup)($rootScope);
			var element = $compile(grid)($rootScope);
			$rootScope.$digest();

			expect(element.html()).toEqual(expectedElement.html());
		});
	});
});
