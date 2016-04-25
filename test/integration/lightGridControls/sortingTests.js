describe("Sorting", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var $timeout;

	var grid;

	var gridMarkup =
		"<table lg-grid model='dataProvider.getGridModel()'>" +
			"<tr>" +
				"<th class='first'><span lg-sorter sort-property='firstName' data-provider='dataProvider'>First Name<span></th>" +
				"<th class='last'><span lg-sorter sort-property='lastName' data-provider='dataProvider'>Last Name<span></th>" +
			"</tr>" +
			"<tr lg-row>" +
				"<td class='first'>{{ row.data.firstName }}</td>" +
				"<td class='last'>{{ row.data.lastName }}</td>" +
			"</tr>" +
		"</table>";

	beforeEach(function () {
		module("lightGrid");
		module("lightGridControls");
		module("lightGridDataProviders");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, _lgLocalDataProviderFactory_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;

		$rootScope.model = [
			{ firstName: "Peregrin", lastName: "Tuk" },
			{ firstName: "Samwise", lastName: "Gamgee" },
			{ firstName: "Meriadok", lastName: "Brandybuck" },
			{ firstName: "Frodo", lastName: "Baggins" }
		];

		$rootScope.dataProvider = _lgLocalDataProviderFactory_.create($rootScope.model);
	}));

	beforeEach(function () {
		grid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();
	});

	describe("when first column sorter is clicked", function () {
		beforeEach(function () {
			grid.find("th.first span[lg-sorter]").click();
			$rootScope.$digest();
			$timeout.flush();
		});

		it("should sort the data in the grid in ascending order", function () {
			var rows = grid.find("td.first");
			expect(rows.eq(0).text()).toBe("Frodo");
			expect(rows.eq(1).text()).toBe("Meriadok");
			expect(rows.eq(2).text()).toBe("Peregrin");
			expect(rows.eq(3).text()).toBe("Samwise");
		});

		describe("and then clicked again", function () {
			it("should sort the data in the grid in descending order", function () {
				grid.find("th.first span[lg-sorter]").click();
				$rootScope.$digest();
				$timeout.flush();

				var rows = grid.find("td.first");

				expect(rows.eq(0).text()).toBe("Samwise");
				expect(rows.eq(1).text()).toBe("Peregrin");
				expect(rows.eq(2).text()).toBe("Meriadok");
				expect(rows.eq(3).text()).toBe("Frodo");
			});
		});
	});
});