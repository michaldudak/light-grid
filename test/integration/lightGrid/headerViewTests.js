/* global beforeEach, describe, it, expect, inject, module */

describe("Header view", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var grid =
		"<lg-grid id='testGrid' model='model'>" +
			"<lg-column title='columnTitle'></lg-column>" +
			"<lg-column><lg-header-view>{{columnTitle}}</lg-header-view></lg-column>" +
		"</lg-grid>";

	beforeEach(function () {
		module("lightGrid");
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.model = [
			{ id: "one" },
			{ id: "two" },
			{ id: "three" }
		];
		
		$rootScope.columnTitle = "ID";
	}));

	describe("when the header is defined with a lg-header-view directive", function() {
		it("should be rendered the same as with the title attribute on the lg-column", function() {
			var element = $compile(grid)($rootScope);
			$rootScope.$digest();
			
			expect(element.find("th:eq(1)").text()).toBe(element.find("th:eq(0)").text());
		});
	});
});
