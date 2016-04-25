describe("Light Grid: Sorter directive tests", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var $timeout;

	var gridMarkup =
		"<table lg-grid model='dataProvider.getGridModel()'>" +
			"<tr>" +
				"<th><span lg-sorter sort-property='firstName' data-provider='dataProvider'>First Name<span></th>" +
			"</tr>" +
			"<tr lg-row>" +
				"<td>{{ row.data.firstName }}</td>" +
			"</tr>" +
		"</table>";

	beforeEach(function () {
		module("lightGrid");
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;

		$rootScope.model = [
			{ firstName: "John", lastName: "Doe" },
			{ firstName: "Adam", lastName: "Smith" }
		];

		$rootScope.dataProvider = {};
	}));

	it("should render the directive properly", function () {
		var compiledGrid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();

		var sorter = compiledGrid.find("span[lg-sorter]");

		expect(sorter).toBeDefined();
		expect(sorter.length).toEqual(1);
		expect(sorter.hasClass("sorter")).toBeTruthy();
		expect(sorter.find(".columnTitle").length).toEqual(1);
	});

	it("should call the orderBy method of data provider when clicked", function() {
		var emptyArray = [];
		$rootScope.dataProvider = {
			getGridModel: function() {
				return emptyArray;
			},
			orderBy: jasmine.createSpy("orderBy")
		};

		var compiledGrid = $compile(gridMarkup)($rootScope);
		$rootScope.$digest();

		var sorter = compiledGrid.find("span[lg-sorter]");
		sorter.trigger("click");
		$timeout.flush();

		expect($rootScope.dataProvider.orderBy).toHaveBeenCalledWith("firstName", false);
	});

	it("should set a 'sorter-asc' CSS class when a corresponding column is sorted in ascending order", function() {
		var compiledGrid = $compile(gridMarkup)($rootScope);

		var viewSettings = {
			orderBy: {
				expression: "firstName",
				reverse: false
			}
		};

		$rootScope.dataProvider.getCurrentViewSettings = function() {
			return viewSettings;
		};

		$rootScope.$digest();

		var sorter = compiledGrid.find("span[lg-sorter]");
		expect(sorter.hasClass("sorter-asc")).toBeTruthy();
		expect(sorter.hasClass("sorter-desc")).toBeFalsy();
	});

	it("should set a 'sorter-desc' CSS class when a corresponding column is sorted in descending order", function () {
		var compiledGrid = $compile(gridMarkup)($rootScope);

		var viewSettings = {
			orderBy: {
				expression: "firstName",
				reverse: true
			}
		};

		$rootScope.dataProvider.getCurrentViewSettings = function () {
			return viewSettings;
		};

		$rootScope.$digest();

		var sorter = compiledGrid.find("span[lg-sorter]");

		expect(sorter.hasClass("sorter-desc")).toBeTruthy();
		expect(sorter.hasClass("sorter-asc")).toBeFalsy();
	});

	it("should not have 'sorter-asc' or 'sorter-desc' CSS classes when another column in the grid is sorted", function () {
		var compiledGrid = $compile(gridMarkup)($rootScope);

		var viewSettings = {
			orderBy: {
				expression: "lastName",
				reverse: true
			}
		};

		$rootScope.dataProvider.getCurrentViewSettings = function () {
			return viewSettings;
		};

		$rootScope.$digest();

		var sorter = compiledGrid.find("span[lg-sorter]");

		expect(sorter.hasClass("sorter-desc")).toBeFalsy();
		expect(sorter.hasClass("sorter-asc")).toBeFalsy();
	});
});
