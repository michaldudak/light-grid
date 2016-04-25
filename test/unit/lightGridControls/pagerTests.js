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
			page: jasmine.createSpy("page"),
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

	describe("navigation buttons", function() {
		var element;

		beforeEach(function() {
			element = $compile(markup)($rootScope);
			$rootScope.$digest();

			$rootScope.providerMock.limitTo.calls.reset();
		});

		describe("First", function() {
			it("should call the page method of the provider", function() {
				element.find(".first").click();
				expect($rootScope.providerMock.page).toHaveBeenCalledWith(0);
			});
		});

		describe("Previous", function() {
			it("should call the page method of the provider", function() {
				element.find(".previous").click();
				expect($rootScope.providerMock.page).toHaveBeenCalledWith(1);
			});
		});

		describe("Next", function() {
			it("should call the page method of the provider", function() {
				element.find(".next").click();
				expect($rootScope.providerMock.page).toHaveBeenCalledWith(3);
			});
		});

		describe("Last", function() {
			it("should call the page method of the provider", function() {
				element.find(".last").click();
				expect($rootScope.providerMock.page).toHaveBeenCalledWith(4);
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
