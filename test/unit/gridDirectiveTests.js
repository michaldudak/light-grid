describe("Grid directive tests", function () {
	"use strict";

	var $compile;
	var $rootScope;
	
	beforeEach(module("light-grid"));
	
	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));
	
	it("Replaces the directive with a table tag", function () {
		var element = $compile("<light-grid id='testGrid'></light-grid>")($rootScope);
		$rootScope.$digest();
		expect(element[0].nodeName).toEqual("TABLE");
	});
});