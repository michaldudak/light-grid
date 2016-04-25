describe("View modes with paging", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var dataProvider;
	var grid;
	var pager;

	var PAGE_SIZE = 10;

	var gridMarkup = "\
		<table lg-grid model='dataProvider.getGridModel()'> \
			<tr lg-row> \
				<td> \
					<lg-view>Default view: {{ row.data.value }}</lg-view> \
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

	beforeEach(inject(function (_$compile_, _$rootScope_, _lgLocalDataProviderFactory_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

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
		describe("and view is left at default", function () {
			xit("should show the second page of data", function () {
				// issue related to https://github.com/angular/angular.js/issues/14506
				pager.find(".next").click();
				$rootScope.$digest();

				expect(grid.find("tr").length).toEqual(PAGE_SIZE);
				expect(grid.find("tr:eq(0) td:eq(0)").text().trim()).toEqual("Default view: Value 10");
			});
		});
	});
});