/* global beforeEach, jasmine, describe, it, expect, inject, module */

describe("Light Grid: Pager directive tests", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var markup = "<lg-pager provider='providerMock'></lg-pager>";
	
	var testValues = {
		LIMIT_TO: 25,
		BEGIN: 42,
		MODEL_ITEM_COUNT: 123
	};

	beforeEach(function () {
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.providerMock = {
			limitTo: jasmine.createSpy("limitTo"),
			getCurrentViewSettings: function() {
				return {
					limitTo: testValues.LIMIT_TO,
					begin: testValues.BEGIN
				};
			},
			getModelItemCount: function() {
				return testValues.MODEL_ITEM_COUNT;
			}
		};
	}));

	it("should render the directive properly", function () {
		var element = $compile(markup)($rootScope);
		$rootScope.$digest();

		expect(element.find(".pager").length).toEqual(1);
		expect(element.html()).not.toContain("{{");
	});
	
	it("should display the correct number of pages upon creation", function() {
		
	});
});
