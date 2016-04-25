describe("View modes with paging", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var $timeout;
	var dataProvider;
	var grid;
	var pager;

	var PAGE_SIZE = 10;

	var gridMarkup = "\
		<table lg-grid model='dataProvider.getGridModel()'> \
			<tr lg-row> \
				<td> \
					<lg-view view='default'>Default view: {{ row.data.value }}</lg-view> \
					<lg-view view='alternate'>Alternate view: {{ row.data.value }}</lg-view> \
					<lg-view view='editable'><input ng-model='row.viewData.value' /></lg-view> \
				</td> \
				<td> \
					<button class='vw-default' lg-switch-view='default'></button> \
					<button class='vw-alternate' lg-switch-view='alternate'></button> \
					<button class='vw-editable' lg-switch-view='editable'></button> \
				</td> \
			</tr> \
		</table>";

	var pagerMarkup = "<lg-pager provider='dataProvider'></lg-pager>";

	beforeEach(function () {
		module("lightGrid");
		module("lightGridDataProviders");
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, _lgLocalDataProviderFactory_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;

		$rootScope.model = [];

		for (var i = 0; i < 42; ++i) {
			$rootScope.model.push({ value: "Value " + i });
		}

		dataProvider = _lgLocalDataProviderFactory_.create($rootScope.model);
		dataProvider.setPageSize(PAGE_SIZE);
		$rootScope.dataProvider = dataProvider;

		grid = $compile(gridMarkup)($rootScope);
		pager = $compile(pagerMarkup)($rootScope);
		$rootScope.$digest();
	}));

	describe("when page is changed to the second one", function () {
		beforeEach(function () {
			pager.find(".next").click();
			$rootScope.$digest();
		});

		describe("and view is left at default", function () {
			it("should show the second page of data", function () {
				expect(grid.find("tr").length).toEqual(PAGE_SIZE);
				expect(grid.find("tr:eq(0) td:eq(0)").text().trim()).toEqual("Default view: Value 10");
			});
		});

		describe("and view is changed to alternate", function () {
			beforeEach(function () {
				grid.find("tr:eq(0) .vw-alternate").click();
				$rootScope.$digest();
				$timeout.flush();
			});

			it("should show the alternate view content", function () {
				expect(grid.find("tr:eq(0) td:eq(0)").text().trim()).toEqual("Alternate view: Value 10");
			});

			describe("and page is changed to the next one", function () {
				it("the first row should switch back to default view", function () {
					pager.find(".next").click();
					$rootScope.$digest();
					expect(grid.find("tr:eq(0) td:eq(0)").text().trim()).toEqual("Default view: Value 20");
				});
			});
		});
	});
});