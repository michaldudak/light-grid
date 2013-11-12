grid.module.directive("lightGrid", ["$q", function gridDirective($q) {
	"use strict";

	var gridController = ["$scope", "$element", "$rootScope", function GridController($scope, $element, $rootScope) {
		var EVENT_PREFIX = "lightGrid.";

		// empty fallback data provider
		var dataProviderController = {
			getData: function() {
				return $scope.data;
			},
			sort: function() {},
			changePage: function () {},
			filter: function() {},
			persistData: function () {},
			addRecord: function () {},
			removeRecord: function () {}
		};
		
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

		this.getDataProvider = function() {
			return dataProviderController;
		};

		this.switchView = function(viewName) {
			$scope.$broadcast(EVENT_PREFIX + "row.switchView", viewName);
			fireEvent("switchedView", viewName);
		};

		this.getDomElement = function() {
			return $element;
		};

		this.getScope = function() {
			return $scope;
		};

		registerEventHandler("switchView");
	}];

	var defaultTemplate =
		"<table class='angular-grid'>" +
			"<thead><tr header-row></tr></thead>" +
			"<tbody><tr row default-view='read' ng-repeat='rowData in data'></tr></tbody>" +
		"</table>";
	
	return {
		scope: {
			data: "=?",
			id: "@"
		},
		template: defaultTemplate,
		replace: true,
		restrict: "EA",
		transclude: true,
		compile: function(tElement, tAttrs, transclude) {
			return function postLink(scope, elem) {
				if (typeof (scope.id) === "undefined" || scope.id === "") {
					throw new Error("The grid must have an id attribute.");
				}

				// directives such as dataProvider require access to the parent of the grid scope,
				// so they can't be linked with the grid scope (as it's isolated).
				var transclusionScope = scope.$parent.$new();
				transclude(transclusionScope, function(clone) {
					elem.append(clone);
				});

				$q.when(scope.gridController.getDataProvider().getData()).then(function(data) {
					scope.data = data;
				});
			};
		},
		controller: gridController,
		controllerAs: "gridController",
	};
}]);