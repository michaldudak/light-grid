(function(window, ng) {

	var app = ng.module("angularGridSample", ["angular-grid"]);
	window.app = app;

	app.controller("SampleController", function($scope) {
		var counter = 7;

		$scope.localModel = [
			{ firstName: "1", lastName: "A" },
			{ firstName: "2", lastName: "B" },
			{ firstName: "3", lastName: "C" },
			{ firstName: "4", lastName: "D" },
			{ firstName: "5", lastName: "E" },
			{ firstName: "6", lastName: "F" }
		];
	});

}(window, window.angular));