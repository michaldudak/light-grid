/* global beforeEach, jasmine, describe, it, expect, inject, module */

describe("lgPager directive tests", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var markup = "<lg-pager provider='providerMock'></lg-pager>";
	
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

	it("should render the directive properly", function () {
		var element = $compile(markup)($rootScope);
		$rootScope.$digest();

		expect(element.find(".pager").length).toEqual(1);
		expect(element.html()).not.toContain("{{");
	});
	
	describe("when on first page (but not last)", function() {
		beforeEach(function () {
			testValues.BEGIN = 0;
		});
		
		it("should disable the 'first' and 'previous' buttons", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			expect(element.find(".first").is(":disabled")).toBe(true);
			expect(element.find(".previous").is(":disabled")).toBe(true);
		});
		
		it("should not disable the 'next' and 'last' buttons", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			expect(element.find(".next").is(":disabled")).toBe(false);
			expect(element.find(".last").is(":disabled")).toBe(false);
		});
	});
	
	describe("when on last page (but not first)", function() {
		beforeEach(function () {
			testValues.BEGIN = 100;
		});
		
		it("should not disable the 'first' and 'previous' buttons", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			expect(element.find(".first").is(":disabled")).toBe(false);
			expect(element.find(".previous").is(":disabled")).toBe(false);
		});
		
		it("should disable the 'next' and 'last' buttons", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			expect(element.find(".next").is(":disabled")).toBe(true);
			expect(element.find(".last").is(":disabled")).toBe(true);
		});
	});
	
	describe("when on first page that is also the last", function() {
		beforeEach(function () {
			testValues.BEGIN = 0;
			testValues.MODEL_ITEM_COUNT = 20;
		});
		
		it("should disable all navigation buttons", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			expect(element.find(".first").is(":disabled")).toBe(true);
			expect(element.find(".previous").is(":disabled")).toBe(true);
			expect(element.find(".next").is(":disabled")).toBe(true);
			expect(element.find(".last").is(":disabled")).toBe(true);
		});
	});

	describe("when on middle page", function() {
		it("should enable all navigation buttons", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			expect(element.find(".first").is(":disabled")).toBe(false);
			expect(element.find(".previous").is(":disabled")).toBe(false);
			expect(element.find(".next").is(":disabled")).toBe(false);
			expect(element.find(".last").is(":disabled")).toBe(false);
		});
	});
	
	describe("page size options", function() {
		describe("when not explicitly defined", function() {
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
				element.attr("page-size-options", "2,25,52,925");
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
				element.attr("page-size-options", "");
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
				element.attr("page-size-options", "foo");
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
	
	describe("navigation buttons", function() {
		var element;
		
		beforeEach(function() {
			element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			$rootScope.providerMock.limitTo.calls.reset();
		});
		
		describe("First", function() {
			it("should call the limitTo method of the provider", function() {
				element.find(".first").click();
				expect($rootScope.providerMock.limitTo).toHaveBeenCalledWith(25, 0);
			});
		});
		
		describe("Previous", function() {
			it("should call the limitTo method of the provider", function() {
				element.find(".previous").click();
				expect($rootScope.providerMock.limitTo).toHaveBeenCalledWith(25, 25);
			});
		});
		
		describe("Next", function() {
			it("should call the limitTo method of the provider", function() {
				element.find(".next").click();
				expect($rootScope.providerMock.limitTo).toHaveBeenCalledWith(25, 75);
			});
		});
		
		describe("Last", function() {
			it("should call the limitTo method of the provider", function() {
				element.find(".last").click();
				expect($rootScope.providerMock.limitTo).toHaveBeenCalledWith(25, 100);
			});
		});
	});
	
	describe("summary", function() {
		it("should display the correct number of pages upon creation", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
	
			expect(element.find(".pager-summary").text()).toEqual("Page 3 of 5");
		});
		 
		describe("when provider values change", function() {
			it("should display the updated values", function() {
				var element = $compile(markup)($rootScope);
				$rootScope.$digest();
				
				var pagerSummary = element.find(".pager-summary");
				expect(pagerSummary.text()).toEqual("Page 3 of 5");
				
				testValues = {
					LIMIT_TO: 10,
					BEGIN: 30,
					MODEL_ITEM_COUNT: 200
				};
				
				$rootScope.$digest();
				expect(pagerSummary.text()).toEqual("Page 4 of 20");
			});
		});
	});
});
