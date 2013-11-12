(function(window, ng) {

	var app = ng.module("angularGridSample", ["light-grid"]);
	window.app = app;

	app.controller("SampleController", function($scope) {
		$scope.localModel = [
			{
				"firstName": "Aidan",
				"lastName": "Wheeler"
			},
			{
				"firstName": "Chase",
				"lastName": "Buckner"
			},
			{
				"firstName": "Quinlan",
				"lastName": "Atkinson"
			},
			{
				"firstName": "Connor",
				"lastName": "Watts"
			},
			{
				"firstName": "Russell",
				"lastName": "Blake"
			},
			{
				"firstName": "Tobias",
				"lastName": "Dickson"
			},
			{
				"firstName": "Hyatt",
				"lastName": "Hudson"
			},
			{
				"firstName": "Julian",
				"lastName": "Gamble"
			},
			{
				"firstName": "Christian",
				"lastName": "Lawrence"
			},
			{
				"firstName": "Russell",
				"lastName": "Gallegos"
			},
			{
				"firstName": "Clinton",
				"lastName": "Roman"
			},
			{
				"firstName": "Cullen",
				"lastName": "Vaughn"
			},
			{
				"firstName": "Hamish",
				"lastName": "Snow"
			},
			{
				"firstName": "Luke",
				"lastName": "Sherman"
			},
			{
				"firstName": "Ray",
				"lastName": "Booker"
			},
			{
				"firstName": "Hilel",
				"lastName": "Stanley"
			},
			{
				"firstName": "Drake",
				"lastName": "Bradford"
			},
			{
				"firstName": "Callum",
				"lastName": "Jefferson"
			},
			{
				"firstName": "Kasimir",
				"lastName": "Logan"
			},
			{
				"firstName": "Justin",
				"lastName": "Espinoza"
			},
			{
				"firstName": "Garth",
				"lastName": "Bonner"
			},
			{
				"firstName": "Jin",
				"lastName": "Manning"
			},
			{
				"firstName": "Rigel",
				"lastName": "Franklin"
			},
			{
				"firstName": "Keane",
				"lastName": "Stokes"
			},
			{
				"firstName": "Drew",
				"lastName": "Griffith"
			},
			{
				"firstName": "Carson",
				"lastName": "Daniel"
			},
			{
				"firstName": "Chaney",
				"lastName": "Bruce"
			},
			{
				"firstName": "Geoffrey",
				"lastName": "Merrill"
			},
			{
				"firstName": "Wing",
				"lastName": "Barrera"
			},
			{
				"firstName": "Honorato",
				"lastName": "Riggs"
			},
			{
				"firstName": "Brendan",
				"lastName": "Vance"
			},
			{
				"firstName": "Logan",
				"lastName": "Hodge"
			},
			{
				"firstName": "Abraham",
				"lastName": "Russell"
			},
			{
				"firstName": "Thor",
				"lastName": "Matthews"
			},
			{
				"firstName": "Ethan",
				"lastName": "Howe"
			},
			{
				"firstName": "Samuel",
				"lastName": "Poole"
			},
			{
				"firstName": "John",
				"lastName": "Gutierrez"
			},
			{
				"firstName": "Dillon",
				"lastName": "Gonzales"
			}
		];
		
		$scope.staticText = "some random text";

		$scope.modifyModel = function() {
			$scope.localModel.splice(0, 1);
		};

		$scope.switchView = function() {
			if ($scope.currentView === "edit") {
				$scope.currentView = "read";
			} else {
				$scope.currentView = "edit";
			}

			$scope.$broadcast("lightGrid.switchView", "sampleGrid", $scope.currentView);
		};

		$scope.getRecords = function (options) {
			console.log("Requesting data", options);
			return $scope.localModel;
		};
		
		$scope.addRecord = function (record) {
			console.log("Adding record", record);
		};
		
		$scope.updateRecords = function (records) {
			console.log("Updating records", records);
		};
		
		$scope.deleteRecord = function (record) {
			console.log("Deleting record", record);
		};
	});

}(window, window.angular));