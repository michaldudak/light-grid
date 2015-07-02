/* global beforeEach, jasmine, describe, it, expect, inject, module */

describe("lgPager directive tests", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var markup = "<lg-persist-data provider='providerMock'></lg-persist-data>";
	
	beforeEach(function () {
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$rootScope.viewData = { foo: "bar" };

		$rootScope.providerMock = {
			saveModel: jasmine.createSpy("acceptViewModel")
		};
		
		$rootScope.rowController = {
			acceptViewModel: jasmine.createSpy("acceptViewModel"),
			switchView: jasmine.createSpy("switchView")
		};
	}));
	
	describe("when clicked", function() {
		it("should call the provider's saveModel method", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			element.click();
			
			expect($rootScope.providerMock.saveModel).toHaveBeenCalledWith($rootScope.viewData);
		});
		
		it("should accept the view model and switch view to 'read'", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();
			
			element.click();
			$rootScope.$digest();
			
			expect($rootScope.rowController.acceptViewModel).toHaveBeenCalled();
			expect($rootScope.rowController.switchView).toHaveBeenCalledWith("read");
		});
	});
});