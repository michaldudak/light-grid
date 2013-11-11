grid.module.directive("lightGrid", function gridDirective() {
	"use strict";

	var gridController = ["$scope", "$element", "$rootScope", function GridController($scope, $element, $rootScope) {
		var EVENT_PREFIX = "lightGrid.";

		var dataProviderController = null;
		var self = this;

		$scope.columnDefinitions = [];

		function registerEventHandler(name) {
			$scope.$on(EVENT_PREFIX + name, function(event, gridId) {
				if (gridId !== $scope.id) {
					return;
				}

				[].splice.call(arguments, 0, 2);

				self[name].apply(self, arguments);
			});
		}

		function fireEvent(name) {
			name = EVENT_PREFIX + name;
			[].splice.call(arguments, 1, 0, $scope.id);
			$rootScope.$broadcast.apply($rootScope, arguments);
		}

		this.getData = function getData() {
			return $scope.data;
		};

		this.setData = function setData(newData) {
			$scope.data = newData;
		};

		this.defineColumn = function(column) {
			$scope.columnDefinitions.push(column);
		};

		this.registerDataProvider = function(dataProvider) {
			dataProviderController = dataProvider;
		};

		this.switchView = function(viewName) {
			$scope.view = viewName;
			fireEvent("switchedView", viewName);
		};

		registerEventHandler("switchView");
	}];

	var defaultTemplate =
		"<table class='angular-grid'>" +
			"<thead><tr header-row></tr></thead>" +
			"<tbody><tr row ng-repeat='rowData in data'></tr></tbody>" +
		"</table>";
	
	return {
		scope: {
			data: "=?",
			extraSettings: "=?",
			id: "@"
		},
		template: defaultTemplate,
		replace: true,
		restrict: "EA",
		transclude: true,
		compile: function(tElement, tAttrs, transclude) {
			return function postLink(scope, elem, attr) {
				if (typeof (scope.id) === "undefined" || scope.id === "") {
					throw new Error("The grid must have an id attribute.");
				}

				var transclusionScope = scope.$parent.$new();
				transclude(transclusionScope, function(clone) {
					elem.append(clone);
				});
			};
		},
		controller: gridController,
		controllerAs: "gridController",
	};
});