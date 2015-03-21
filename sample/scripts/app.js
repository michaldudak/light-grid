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
			.when("/client-side-search", {
				templateUrl: "views/clientSideSearch.html"
			})
			.when("/client-side-paging", {
				templateUrl: "views/clientSidePaging.html"
			})
			.when("/hidden-columns", {
				templateUrl: "views/hiddenColumns.html"
			})
			.otherwise({
				redirectTo: "/simplest"
			});
	});

	app.constant("sampleModel", [
		{
			make: "Honda",
			model: "CBF 1000F",
			engine: "998cm R4"
		}, {
			make: "BMW",
			model: "F800 GT",
			engine: "800ccm R2"
		}, {
			make: "Suzuki",
			model: "V-Strom 1000",
			engine: "1000ccm V2"
		}, {
			make: "KTM",
			model: "690 Duke",
			engine: "690ccm single"
		}, {
			make: "Kawasaki",
			model: "H2R",
			engine: "998ccm R4 supercharged"
		}

	]);

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

}(window, window.angular));
