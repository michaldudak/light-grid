describe("Data persistence", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var dataProvider;

	var grid =
		"<table lg-grid model='dataProvider.getGridModel()' initial-view='edit'>" +
			"<tr lg-row>" +
				"<td>" +
					"<lg-view view='read'>{{row.data.value}}</lg-view>" +
					"<lg-view view='edit'><input ng-model='row.data.value' /></lg-view>" +
				"</td>" +
				"<td>" +
					"<button lg-persist-data data-provider='dataProvider'></button>" +
				"</td>" +
			"</tr>" +
		"</table>";

	beforeEach(function () {
		module("lightGrid");
		module("lightGridControls");
		module("lightGridDataProviders");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _lgLocalDataProviderFactory_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.model = [{ value: "A" }, { value: "B" }, { value: "C" }];

		dataProvider = _lgLocalDataProviderFactory_.create($rootScope.model);
		$rootScope.dataProvider = dataProvider;
	}));

	describe("when edited a value in an 'edit' view", function () {
		var compiledGrid;

		beforeEach(function () {
			compiledGrid = $compile(grid)($rootScope);
			$rootScope.$digest();

			var firstInput = compiledGrid.find("input:eq(0)");
			firstInput.val("modified");

			$rootScope.$digest();
		});

		describe("and did not click on the lg-persist-data button", function () {
			it("should not modify the model", function () {
				expect($rootScope.model[0].value).toEqual("A");
			});

			it("should not change the view to 'read'", function () {
				expect(compiledGrid.find("input").length).toEqual(3);
			});
		});

		describe("and clicked on the lg-persist-data button", function () {
			beforeEach(function () {
				var button = compiledGrid.find("button:eq(0)");
				button.click();
				$rootScope.$digest();
			});

			it("should not modify the model", function () {
				expect($rootScope.model[0].value).toEqual("A");
			});

			it("should change the row view to 'read'", function () {
				expect(compiledGrid.find("input").length).toEqual(2);
				expect(compiledGrid.find("tr:eq(0) input").length).toEqual(0);
			});
		});
	});
});