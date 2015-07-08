/* global beforeEach, describe, it, expect, inject, module */

describe("Grid directive tests:", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var emptyGridMarkup = "<table lg-grid model='model'></table>";

	beforeEach(module("lightGrid"));

	beforeEach(inject(function(_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
	}));

	it("should append the 'light-grid' CSS class to the table", function() {
		var element = $compile(emptyGridMarkup)($rootScope);
		$rootScope.$digest();

		expect(element.hasClass("light-grid")).toBeTruthy();
	});
});
