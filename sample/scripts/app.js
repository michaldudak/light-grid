(function (window, ng) {
	"use strict";

	var app = ng.module("lightGridSamples", ["light-grid", "ngRoute"]);
	window.app = app;

	app.config(function($routeProvider, $controllerProvider) {

		$controllerProvider.allowGlobals();

		$routeProvider
			.when("/simplest", {
				templateUrl: "views/simplest.html"
			})
			.when("/local-data", {
				templateUrl: "views/localData.html"
			})
			.when("/expanded-row", {
				templateUrl: "views/expandedRow.html"
			})
			.when("/local-editable-row", {
				templateUrl: "views/localEditableRow.html"
			})
			.when("/sortable-columns", {
				templateUrl: "views/sortableColumns.html"
			})
			.otherwise({
				redirectTo: "/simplest"
			});
	});

	app.run(function ($rootScope) {
		// log all Angular events to the console for debugging
		var originalBroadcast = $rootScope.constructor.prototype.$broadcast;
		$rootScope.constructor.prototype.$broadcast = function (event) {
			window.console.log("Broadcasting event: " + event + ". Source and data:", this, [].slice.call(arguments, 1));
			return originalBroadcast.apply(this, arguments);
		};

		var originalEmit = $rootScope.constructor.prototype.$emit;
		$rootScope.constructor.prototype.$emit = function (event) {
			window.console.log("Emitting event: " + event + ". Source and data:", this, [].slice.call(arguments, 1));
			return originalEmit.call(this, arguments);
		};
	});

	app.controller("SampleController", function($scope, $rootScope, $http, lgGridService) {

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

			lgGridService.getGridController("sampleGrid").switchView($scope.currentView);
		};

		$scope.getRecords = function (options) {
			console.log("Requesting data", options);
			return $http.get("scripts/sampleData.json");
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

		$scope.saveAll = function() {
			var ctrl = lgGridService.getGridController("customProviderGrid");
			var dataProvider = ctrl.getDataProvider();

			dataProvider.updateRecords(ctrl.getViewData());

			console.log(ctrl.getViewData());
			ctrl.acceptViewModel();
			ctrl.switchView("read");
			$scope.currentView = "read";
		};

		$scope.sort = function() {
			if ($scope.sortProperty === "firstName") {
				$scope.sortProperty = "lastName";
			} else {
				$scope.sortProperty = "firstName";
			}

			var dataProvider = lgGridService.getDataProvider("sampleGrid");
			dataProvider.sort($scope.sortProperty, false);
		};

		$scope.nextPage = function() {
			if (!$scope.pageNumber) {
				$scope.pageNumber = 1;
			} else {
				$scope.pageNumber++;
			}
			
			var dataProvider = lgGridService.getDataProvider("sampleGrid");
			dataProvider.changePage($scope.pageNumber, 10);
		};
		
		$scope.prevPage = function () {
			if ($scope.pageNumber <= 2) {
				$scope.pageNumber = 1;
			} else {
				$scope.pageNumber--;
			}

			var dataProvider = lgGridService.getDataProvider("sampleGrid");
			dataProvider.changePage($scope.pageNumber, 10);
		};

		$scope.$watch("filterExpression", function() {
			var dataProvider = lgGridService.getDataProvider("sampleGrid");
			dataProvider.filter($scope.filterExpression);
		});

		$scope.initialOptions = {
			pageNumber: 1,
			pageSize: 10
		};
	});

}(window, window.angular));