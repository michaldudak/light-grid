describe("Light Grid: View modes tests", function () {
	"use strict";

	var $compile;
	var $rootScope;

	var gridMarkup = "\
		<table lg-grid model='model'> \
			<tr lg-row> \
				<td> \
					<lg-view>Default view</lg-view> \
					<lg-view view='alternate'>Alternate view</lg-view> \
				</td> \
			</tr> \
		</table>";

	var gridElement;

	beforeEach(function () {
		module("lightGrid");
		module("lightGridControls");
	});

	beforeEach(inject(function (_$compile_, _$rootScope_) {
		$compile = _$compile_;
		$rootScope = _$rootScope_;

		$rootScope.model = [
			{ firstName: "John", lastName: "Doe" },
			{ firstName: "Adam", lastName: "Smith" }
		];

		gridElement = $(gridMarkup);
	}));

	describe("when initial-view attribute is not set", function () {
		it("should initially render the default view", function () {
			var element = $compile(gridMarkup)($rootScope);
			$rootScope.$digest();
			var cell = element.find("td:first");

			expect(cell.text().trim()).toBe("Default view");
			expect(element.text()).not.toMatch("Alternate view");
		});
	});

	describe("when initial-view attribute is set", function () {
		it("should initially render the view specified in initial-view attribute", function () {
			gridElement.attr("initial-view", "alternate");
			$compile(gridElement)($rootScope);
			$rootScope.$digest();
			var cell = gridElement.find("td:first");

			expect(cell.text().trim()).toBe("Alternate view");
			expect(gridElement.text()).not.toMatch("Default view");
		});
	});

	describe("when switchView is called", function () {
		describe("on a row, with a known view name", function () {
			it("should change the view of a row", function () {
				var element = $compile(gridMarkup)($rootScope);
				$rootScope.$digest();

				var firstRow = element.find("tbody tr").eq(0);
				var secondRow = element.find("tbody tr").eq(1);

				var rowController = firstRow.scope().row.controller;
				rowController.switchView("alternate");
				$rootScope.$digest();

				expect(firstRow.find("td").text().trim()).toBe("Alternate view");
				expect(secondRow.find("td").text().trim()).toBe("Default view");
			});
		});

		describe("on a row, with unknown view name", function () {
			it("should show the default view", function () {
				gridElement.attr("initial-view", "alternate");
				$compile(gridElement)($rootScope);
				$rootScope.$digest();

				var firstRow = gridElement.find("tbody tr").eq(0);
				var secondRow = gridElement.find("tbody tr").eq(1);

				var rowController = firstRow.scope().row.controller;
				rowController.switchView("unknown");
				$rootScope.$digest();

				expect(firstRow.find("td").text().trim()).toBe("Default view");
				expect(secondRow.find("td").text().trim()).toBe("Alternate view");
			});
		});

		describe("on a grid", function () {
			it("should change the view of all rows when grid's switchView is called", function () {
				var element = $compile(gridMarkup)($rootScope);
				$rootScope.$digest();

				var firstRow = element.find("tbody tr").eq(0);
				var secondRow = element.find("tbody tr").eq(1);

				var gridController = firstRow.scope().grid.controller;
				gridController.switchView("alternate");
				$rootScope.$digest();

				expect(firstRow.find("td").text().trim()).toBe("Alternate view");
				expect(secondRow.find("td").text().trim()).toBe("Alternate view");
			});
		});

		describe("when a view is declared as multiview", function () {
			it("should show the proper view", function () {
				gridElement.find("lg-view[view=alternate]").attr("view", "alternate1, alternate2");
				$compile(gridElement)($rootScope);
				$rootScope.$digest();

				var firstRow = gridElement.find("tbody tr").eq(0);
				var secondRow = gridElement.find("tbody tr").eq(1);

				var firstRowController = firstRow.scope().row.controller;
				var secondRowController = secondRow.scope().row.controller;

				firstRowController.switchView("alternate1");
				secondRowController.switchView("alternate2");
				$rootScope.$digest();

				expect(firstRow.find("td").text().trim()).toBe("Alternate view");
				expect(secondRow.find("td").text().trim()).toBe("Alternate view");
			});
		});
	});
});
