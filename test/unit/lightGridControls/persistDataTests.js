describe("lgPersistData directive tests", function () {
	"use strict";

	var $compile;
	var $rootScope;
	var $timeout;

	var markup = "<button lg-persist-data provider='providerMock'></button>";

	beforeEach(function () {
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$timeout = _$timeout_;

		$rootScope.providerMock = {
			saveModel: jasmine.createSpy("acceptViewModel")
		};

		$rootScope.row = {
			viewModel: { foo: "bar" },
			controller: {
				acceptViewModel: jasmine.createSpy("acceptViewModel"),
				switchView: jasmine.createSpy("switchView")
			}
		};
	}));

	describe("when clicked", function() {
		it("should call the provider's saveModel method", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();

			element.click();
			$timeout.flush();

			expect($rootScope.providerMock.saveModel).toHaveBeenCalledWith($rootScope.viewData);
		});

		it("should accept the view model and switch view to 'read'", function() {
			var element = $compile(markup)($rootScope);
			$rootScope.$digest();

			element.click();
			$rootScope.$digest();
			$timeout.flush();

			expect($rootScope.row.controller.acceptViewModel).toHaveBeenCalled();
			expect($rootScope.row.controller.switchView).toHaveBeenCalledWith("read");
		});
	});
});
