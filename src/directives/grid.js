/**
 * The root grid directive.
 * Parameters:
 *  - id - {String} ID of the grid. This attribute must be present and unique.
 *  - data - {Array} (interpolated) data model displayed on the grid (optional).
 *  - initial-view - {String} Name of the initial view mode of all rows in the grid.
 */
angular.module("light-grid").directive("lightGrid", function gridDirective(lgGridService) {
	"use strict";

	var gridController = function GridController($scope, $element) {

		var columnDefinitions = {};
		$scope.visibleColumns = [];
		
		/**
		 * Gets the model displayed on the grid.
		 * @return {Array} Model displayed on the grid.
		 */
		this.getData = function getData() {
			return $scope.data;
		};

		/**
		 * Gets the current view model displayed on the grid.
		 * @return {Array} Current state of the grid's view model
		 */
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

		/**
		 * Sets the model of the grid.
		 * @param {[type]} newData [description]
		 */
		this.setData = function setData(newData) {
			$scope.data = newData;
		};

		function updateVisibleColumns() {
			$scope.visibleColumns.length = 0;
			
			for (var id in columnDefinitions) {
				if (columnDefinitions.hasOwnProperty(id) && columnDefinitions[id].definition.visible) {
					$scope.visibleColumns.push(columnDefinitions[id].definition);
				}
			}
		}

		/**
		 * Registers a column template.
		 * @param  {Object} columnDefinition Column definition object
		 */
		this.defineColumn = function(id, columnDefinition) {
			columnDefinitions[id] = { definition: columnDefinition };

			updateVisibleColumns();
		};

		/**
		 * Updates a registered column template.
		 * @param  {Object} columnDefinition Column definition object
		 */
		this.updateColumn = function (id, columnDefinition) {
			if (!columnDefinitions.hasOwnProperty(id)) {
				throw new Error("Column " + id + " was not registered.");
			}

			angular.extend(columnDefinitions[id].definition, columnDefinition);
			updateVisibleColumns();
		};

		/**
		 * Changes a view in all visible rows of the grid.
		 * This method is asynchronous.
		 *
		 * @param  {String} viewName Name of the new view.
		 * @async
		 */
		this.switchView = function(viewName) {
			$scope.$broadcast("lightGrid.row.switchView", viewName);
		};

		/**
		 * Copies values from the view model to the data model.
		 * This method is asynchronous.
		 *
		 * @async
		 */
		this.acceptViewModel = function() {
			$scope.$broadcast("lightGrid.row.acceptViewModel");
		};

		/**
		 * Gets a jQuery wrapper over the root DOM element of the grid.
		 * @return {jQuery} jQuery object representing the root node of the grid.
		 */
		this.getDomElement = function() {
			return $element;
		};

		/**
		 * Gets the scope of the grid directive.
		 * @return {Scope} Scope of the grid directive.
		 */
		this.getScope = function() {
			return $scope;
		};
		
		/**
		 * Creates a new scope for transcluded elements. The new scope inherits from the grid's parent scope.
		 * @returns {Scope} The new scope.
		 */
		this.createTransclusionScope = function () {
			return $scope.$parent.$new();
		};

		/**
		 * Gets the ID property of the grid.
		 * @return {String} Grid's ID
		 */
		this.getId = function() {
			return $scope.id;
		};
	};

	// TODO: footer support
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
		link: function postLink(scope, elem, attrs, controller, transclude) {
			if (typeof (scope.id) === "undefined" || scope.id === "") {
				throw new Error("The grid must have an id attribute.");
			}

			// directives such as dataProvider require access to the parent of the grid scope,
			// so they can't be linked with the grid scope (as it's isolated).
			var transclusionScope = scope.$parent.$new();
			transclude(transclusionScope, function(clone) {
				elem.append(clone);
			});
				
			lgGridService.registerGrid(scope.id, scope.gridController);

			scope.$on("$destroy", function() {
				lgGridService.unregisterGrid(scope.id);
			});
		},
		controller: gridController,
		controllerAs: "gridController"
	};
});