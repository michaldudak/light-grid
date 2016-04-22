/* global beforeEach, jasmine, describe, it, expect, inject, module, fdescribe */

fdescribe("lgPageSizeOptions directive tests", function() {
	"use strict";

	var $compile;
	var $rootScope;

	var markup = "<lg-page-size-options provider='providerMock'></lg-pager>";

	var testValues;

	beforeEach(function () {
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		testValues = {
			LIMIT_TO: 25,
			BEGIN: 50,
			MODEL_ITEM_COUNT: 123
		};

		$rootScope.providerMock = {
			limitTo: jasmine.createSpy("limitTo"),
			getCurrentViewSettings: function() {
				return {
					limitTo: {
						limit: testValues.LIMIT_TO,
						begin: testValues.BEGIN
					}
				};
			},
			getModelItemCount: function() {
				return testValues.MODEL_ITEM_COUNT;
			}
		};
	}));

	describe("when page size not explicitly defined", function() {
		it("should be set to default", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();

			var options = element.find(".page-size option");
			expect(options.length).toEqual(3);
			expect(options.eq(0).text()).toEqual("10");
			expect(options.eq(0).attr("value")).toEqual("number:10");
			expect(options.eq(1).text()).toEqual("25");
			expect(options.eq(1).attr("value")).toEqual("number:25");
			expect(options.eq(2).text()).toEqual("50");
			expect(options.eq(2).attr("value")).toEqual("number:50");
		});
	});

	describe("when explicitly set", function() {
		it("should respect the custom setting", function() {
			var element = $(markup);
			element.attr("options", "[2,25,52,925]");
			element = $compile(element)($rootScope);
			$rootScope.$digest();

			var options = element.find(".page-size option");
			expect(options.length).toEqual(4);
			expect(options.eq(0).text()).toEqual("2");
			expect(options.eq(0).attr("value")).toEqual("number:2");
			expect(options.eq(1).text()).toEqual("25");
			expect(options.eq(1).attr("value")).toEqual("number:25");
			expect(options.eq(2).text()).toEqual("52");
			expect(options.eq(2).attr("value")).toEqual("number:52");
			expect(options.eq(3).text()).toEqual("925");
			expect(options.eq(3).attr("value")).toEqual("number:925");
		});
	});

	describe("when explicitly set to an empty string", function() {
		it("should use the default settings", function() {
			var element = $(markup);
			element.attr("options", "");
			element = $compile(element)($rootScope);
			$rootScope.$digest();

			var options = element.find(".page-size option");
			expect(options.length).toEqual(3);
			expect(options.eq(0).text()).toEqual("10");
			expect(options.eq(1).text()).toEqual("25");
			expect(options.eq(2).text()).toEqual("50");
		});
	});

	describe("when explicitly set to rubbish", function() {
		it("should use the default settings", function() {
			var element = $(markup);
			element.attr("options", "foo");
			element = $compile(element)($rootScope);
			$rootScope.$digest();

			var options = element.find(".page-size option");
			expect(options.length).toEqual(3);
			expect(options.eq(0).text()).toEqual("10");
			expect(options.eq(1).text()).toEqual("25");
			expect(options.eq(2).text()).toEqual("50");
		});
	});

	describe("when data provider's value change", function() {
		describe("to a value from the select list", function() {
			it("should update the selected value", function() {
				var element = $compile(markup)($rootScope);
				$rootScope.$digest();

				var select = element.find(".page-size select");
				expect(select.val()).toEqual("number:25");

				testValues.LIMIT_TO = 50;
				$rootScope.$digest();
				expect(select.val()).toEqual("number:50");
			});
		});

		describe("to a value outside the select list", function() {
			it("should add the new value to the list update the selected value", function() {
				var element = $compile(markup)($rootScope);
				$rootScope.$digest();

				var select = element.find(".page-size select");
				expect(select.val()).toEqual("number:25");

				testValues.LIMIT_TO = 35;
				$rootScope.$digest();
				expect(select.val()).toEqual("number:35");

				var options = element.find(".page-size option");
				expect(options.length).toEqual(4);
				expect(options.eq(0).text()).toEqual("10");
				expect(options.eq(1).text()).toEqual("25");
				expect(options.eq(2).text()).toEqual("35");
				expect(options.eq(3).text()).toEqual("50");
			});
		});
	});
});