/* global angular, grid */

grid.module.directive("lightGrid", ["lgGridService", function gridDirective(gridService) {
	"use strict";

	var gridController = ["$scope", "$element", "$q", function GridController($scope, $element, $q) {
		
		// empty fallback data provider
		var dataProviderController = {
			getData: function() {
				return $q.when({ data: $scope.data });
			},
			sort: function() {},
			changePage: function () {},
			filter: function() {},
			persistData: function () {},
			addRecord: function () {},
			removeRecord: function () {}
		};
		
		$scope.columnDefinitions = [];
		
		this.getData = function getData() {
			return $scope.data;
		};

		this.getViewData = function getViewData() {
			if (angular.isArray($scope.data)) {
				return $scope.data.map(function(elem) {
					return elem._viewData;
				});
			} else {
				var gridViewData = {};

				for (var prop in $scope.data) {
					if ($scope.data.hasOwnProperty(prop)) {
						gridViewData[prop] = $scope.data[prop]._viewData;
					}
				}

				return gridViewData;
			}
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
			$scope.$broadcast("lightGrid.row.switchView", viewName);
		};

		this.acceptViewModel = function() {
			$scope.$broadcast("lightGrid.row.acceptViewModel");
		};

		this.getDomElement = function() {
			return $element;
		};

		this.getScope = function() {
			return $scope;
		};
	}];

	var defaultTemplate =
		"<table class='light-grid'>" +
			"<thead><tr lg-header-row></tr></thead>" +
			"<tbody><tr lg-row default-view='read' initial-view='{{ initialView || \"read\" }}' ng-repeat='rowData in data'></tr></tbody>" +
		"</table>";
	
	return {
		scope: {
			data: "=?",
			id: "@",
			initialView: "@"
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

				scope.gridController.getDataProvider().getData().then(function(response) {
					scope.data = response.data;
				});

				gridService.registerGrid(scope.id, scope.gridController);

				scope.$on("$destroy", function() {
					gridService.unregisterGrid(scope.id);
				});
			};
		},
		controller: gridController,
		controllerAs: "gridController"
	};
}]);