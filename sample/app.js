(function(window, ng) {

	var app = ng.module("angularGridSample", ["angular-grid"]);
	window.app = app;

	app.controller("SampleController", function($scope, $compile) {
		$scope.localModel = [
			{ firstName: "1", lastName: "A" },
			{ firstName: "2", lastName: "B" },
			{ firstName: "3", lastName: "C" },
			{ firstName: "4", lastName: "D" },
			{ firstName: "5", lastName: "E" },
			{ firstName: "6", lastName: "F" }
		];

		$scope.foo = function() {
			console.log($scope);
		};

		$scope.renderCustomCell = function (rowData, rowId) {
			
			var elem = $("<div><button ng-click=\"gridController.openDetails(" + rowId + ", 'Hello!')\">Open details</button>" +
				"<button ng-click=\"gridController.closeDetails(" + rowId + ")\">Close details</button>" +
				"<button ng-click=\"foo()\">Say hello</button></div>");

			return $compile(elem)($scope);
		};
	});

}(window, window.angular));