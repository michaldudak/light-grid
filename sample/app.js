(function(window, ng) {

	var app = ng.module("angularGridSample", ["angular-grid"]);
	window.app = app;

	app.controller("SampleController", function($scope) {
		$scope.localModel = [
			{ firstName: "FirstName 1", lastName: "LastName A" },
			{ firstName: "FirstName 2", lastName: "LastName B" },
			{ firstName: "FirstName 3", lastName: "LastName C" },
			{ firstName: "FirstName 4", lastName: "LastName D" },
			{ firstName: "FirstName 5", lastName: "LastName E" },
			{ firstName: "FirstName 6", lastName: "LastName F" },
			{ firstName: "FirstName 7", lastName: "LastName G" },
			{ firstName: "FirstName 8", lastName: "LastName H" },
			{ firstName: "FirstName 9", lastName: "LastName I" },
			{ firstName: "FirstName 10", lastName: "LastName J" }
		];
		
		$scope.temp = {};
		$scope.temp.staticText = "record";
	});

}(window, window.angular));