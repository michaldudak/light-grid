grid.module.directive("lightGrid", function () {
	"use strict";

	var gridController = ["$scope", "$element", function GridController($scope, $element) {
		var dataProviderController = null;
		$scope.columnDefinitions = [];
		$scope.expandedRows = {};

		this.getData = function getData() {
			return $scope.data;
		};

		this.setData = function setData(newData) {
			$scope.data = newData;
		};

		this.defineColumn = function(column) {
			$scope.columnDefinitions.push(column);
		};

		this.redraw = function() {
			console.log("Redrawing table");
			var tableElement = tableRenderer.renderTable($scope);
			$element.empty().append(tableElement.children());
		};

		this.registerDataProvider = function(dataProvider) {
			dataProviderController = dataProvider;
		};

		this.switchView = function(viewName) {
			$scope.view = viewName;
		};
	}];

	var template =
		"<table class='angular-grid'>" +
			"<thead><tr header-row ng-transclude></tr></thead>" +
			"<tbody><tr row ng-repeat='rowData in data'></tr></tbody>" +
		"</table>";
	
	return {
		scope: {
			data: "=?",
			extraSettings: "="
		},
		template: template,
		replace: true,
		restrict: "EA",
		transclude: true,
		controller: gridController,
		controllerAs: "gridController",
	};
});