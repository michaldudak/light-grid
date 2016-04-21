/* global beforeEach, describe, it, expect, inject, module */

describe("Paging", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var dataProvider;
	var grid;
	var pager;

	var gridMarkup =
		"<table lg-grid model='dataProvider.getGridModel()'>" +
		"<tr lg-row><td>{{row.data.value}}</td></tr>" +
		"</table>";

	var pagerMarkup = "<lg-pager provider='dataProvider'></lg-pager>";

	var pagerWithSettingsMarkup = "<lg-pager provider='dataProvider' page-size-options='[2,5,8]'></lg-pager>";

	beforeEach(function () {
		module("lightGridControls");
		module("lightGridDataProviders");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _lgLocalDataProviderFactory_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.model = [];

		for (var i = 0; i < 42; ++i) {
			$rootScope.model.push({ value: "Value " + i });
		}

		dataProvider = _lgLocalDataProviderFactory_.create($rootScope.model);
		$rootScope.dataProvider = dataProvider;
	}));

	beforeEach(function () {
		grid = $compile(gridMarkup)($rootScope);
		pager = $compile(pagerMarkup)($rootScope);

		$rootScope.$digest();
	});

	describe("when lg-pager settings are not specified", function () {
		it("should initially have the default (10) page size value", function () {
			expect(grid.find("tr").length).toEqual(10);
		});

		it("should start from the beginning of the data set", function () {
			expect(grid.find("tr:first td").text()).toBe("Value 0");
		});

		it("should allow to choose from a default set of options (10, 25, 50)", function () {
			var pageSizeOptions = pager.find(".page-size select option");

			expect(pageSizeOptions.length).toEqual(3);
			expect(pageSizeOptions.eq(0).attr("value")).toEqual("number:10");
			expect(pageSizeOptions.eq(1).attr("value")).toEqual("number:25");
			expect(pageSizeOptions.eq(2).attr("value")).toEqual("number:50");
		});
	});

	describe("when lg-pager settings are specified", function () {
		beforeEach(function () {
			pager = $compile(pagerWithSettingsMarkup)($rootScope);
			$rootScope.$digest();
		});

		it("should initially have the first specified page size value", function () {
			expect(grid.find("tr").length).toEqual(2);
		});

		it("should start from the beginning of the data set", function () {
			expect(grid.find("tr:first td").text()).toBe("Value 0");
		});

		it("should allow to choose from a specified set of options", function () {
			var pageSizeOptions = pager.find(".page-size select option");

			expect(pageSizeOptions.length).toEqual(3);
			expect(pageSizeOptions.eq(0).attr("value")).toEqual("number:2");
			expect(pageSizeOptions.eq(1).attr("value")).toEqual("number:5");
			expect(pageSizeOptions.eq(2).attr("value")).toEqual("number:8");
		});
	});

	describe("interaction tests", function () {
		describe("when on the first page", function () {
			describe("and the 'previous' button is clicked", function () {
				it("should show the same page", function () {
					pager.find(".previous").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(10);
					expect(grid.find("tr:first td").text()).toBe("Value 0");
				});
			});
		});

		describe("when on the last page", function () {
			beforeEach(function () {
				$rootScope.dataProvider.limitTo(10, 40);
				$rootScope.$digest();
			});

			describe("and the 'next' button is clicked", function () {
				it("should show the same page", function () {
					pager.find(".next").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(2);
					expect(grid.find("tr:first td").text()).toBe("Value 40");
				});
			});

			describe("and page size is increased to 25", function () {
				it("should reset the view to the first page and show 25 elements", function () {
					pager.find(".page-size select").val("number:25").change();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(25);
					expect(grid.find("tr:first td").text()).toBe("Value 0");
				});
			});
		});

		describe("when on middle page", function () {
			beforeEach(function() {
				$rootScope.dataProvider.limitTo(10, 20);
				$rootScope.$digest();
			});

			describe("and the 'next' button is clicked", function () {
				it("should show the next page of results", function () {
					pager.find(".next").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(10);
					expect(grid.find("tr:first td").text()).toBe("Value 30");
				});
			});

			describe("and the 'last' button is clicked", function () {
				it("should show the last page of results", function () {
					pager.find(".last").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(2);
					expect(grid.find("tr:first td").text()).toBe("Value 40");
				});
			});

			describe("and the 'previous' button is clicked", function () {
				it("should show the previous page of results", function () {
					pager.find(".previous").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(10);
					expect(grid.find("tr:first td").text()).toBe("Value 10");
				});
			});

			describe("and the 'first' button is clicked", function () {
				it("should show the first page of results", function () {
					pager.find(".first").click();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(10);
					expect(grid.find("tr:first td").text()).toBe("Value 0");
				});
			});

			describe("and the page size is increased to 25", function () {
				it("should display 25 elements and reset to the first page", function () {

					pager.find(".page-size select").val("number:25").change();
					$rootScope.$digest();

					expect(grid.find("tr").length).toEqual(25);
					expect(grid.find("tr:first td").text()).toBe("Value 0");
				});
			});
		});
	});
});
