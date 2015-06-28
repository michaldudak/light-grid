/* global beforeEach, describe, it, expect, inject, module */

describe("Local data provider integration tests", function () {
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
		module("lightGridDataProviders");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _lgLocalDataProviderFactory_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.model = [{ id: 1 }, { id: 2 }, { id: 3 }];

		dataProvider = _lgLocalDataProviderFactory_.create($rootScope.model);
		$rootScope.dataProvider = dataProvider;
	}));

	describe("when assigned to a given grid and having 4-element array as a model", function() {
		it("should render the data as if it was provided to grid's data property", function() {
			var expectedElement = $compile(gridWithoutDataProviderMarkup)($rootScope);
			var element = $compile(grid)($rootScope);
			$rootScope.$digest();

			expect(element.html()).toEqual(expectedElement.html());
		});
	});
});
