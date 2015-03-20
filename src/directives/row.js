angular.module("light-grid").directive("lgRow", function rowDirective($compile) {
	"use strict";

	var expandingRowMarkup = "<tr ng-if='expandedTemplate'><td colspan='{{visibleColumns.length}}' ng-include='expandedTemplate'></td></tr>";

	function defineViewDataProperty(obj) {
		try {
			Object.defineProperty(obj, "$viewData", {
				configurable: true,
				writable: true
			});
		} catch (err) {
			// IE < 9 does not support properties
			// falling back to plain field

			obj.$viewData = null;
		}
	}

	return {
		restrict: "A",
		template: "<td lg-cell ng-repeat='columnDefinition in visibleColumns'></td>",
		controller: function rowController($scope, $element) {
			var self = this;

			// The scope of the cell content inherits from grid's parent (so creating column templates in markup is intuitive)
			// This scope is augmented with several properties from the row scope (so it's possible to reference e.g. row
			// data in the column template).
			var cellsScope = $scope.gridController.createTransclusionScope();

			// these properties won't ever be overwritten, so it's safe to use simple assignment here
			cellsScope.rowData = $scope.rowData;
			cellsScope.data = $scope.data;
			cellsScope.gridController = $scope.gridController;
			cellsScope.rowController = this;

			// the next two properties may be overwritten in a row scope, so it's necessary to update the cell's scope
			// when this happens
			$scope.$watch("view", function () {
				cellsScope.view = $scope.view;
			});

			$scope.$watch("viewData", function () {
				cellsScope.viewData = $scope.viewData;
			});

			$scope.expandedTemplate = null;

			/**
			 * Gets the scope which the cells should be linked to.
			 */
			this.getCellScope = function () {
				return cellsScope;
			};

			/**
			 * Shows the expanded row below the original one, containing the provided template.
			 * The expanded row has only one cell (spanning across the entire grid width).
			 * @param {String} detailsTemplate - name of the template to load
			 */
			this.openDetails = function (detailsTemplate) {
				$scope.expandedTemplate = detailsTemplate;
			};

			/**
			 * Collapses the expanded row.
			 */
			this.closeDetails = function () {
				$scope.expandedTemplate = null;
			};

			/**
			 * If the row is expanded, collapses it. Otherwise expands it with a given template.
			 * @param {String} detailsTemplate - name of the template to load
			 */
			this.toggleDetails = function (detailsTemplate) {
				if ($scope.expandedTemplate === null) {
					self.openDetails(detailsTemplate);
				} else {
					self.closeDetails();
				}
			};

			/**
			* Changes the view mode of the row.
			* @param {String} viewName - name of the new view
			*/
			this.switchView = function(viewName) {
				if ($scope.view === viewName) {
					return;
				}

				$scope.view = viewName;
				self.resetViewModel();
			};

			/**
			 * Copies values from the row's view model to the data model.
			 */
			this.acceptViewModel = function() {
				angular.extend($scope.rowData, $scope.viewData);
				defineViewDataProperty($scope.rowData);
				$scope.rowData.$viewData = $scope.viewData;
			};

			/**
			 * Discards the row's view model.
			 */
			this.resetViewModel = function() {
				delete $scope.rowData.$viewData;
				$scope.viewData = angular.copy($scope.rowData);
				defineViewDataProperty($scope.rowData);
				$scope.rowData.$viewData = $scope.viewData;
			};

			/**
			 * Gets a jQuery wrapper over the DOM element of the row (TR).
			 * @return {jQuery} jQuery object representing the TR row node.
			 */
			this.getDomElement = function () {
				return $element;
			};

			/**
			 * Adds the specified CSS class to the row node.
			 * @param {String} className - class to add
			 */
			this.addCssClass = function (className) {
				$element.addClass(className);
			};

			/**
			 * Removes the specified CSS class from the row node.
			 * @param {String} className - class to remove
			 */
			this.removeCssClass = function (className) {
				$element.removeClass(className);
			};

			// listening to grid's events
			$scope.$on("lightGrid.row.switchView", function(event, viewName) {
				self.switchView(viewName);
			});

			$scope.$on("lightGrid.row.acceptViewModel", function () {
				self.acceptViewModel();
			});
		},
		controllerAs: "rowController",
		compile: function (tElement) {
			if (tElement[0].nodeName !== "TR") {
				throw new Error("Row directive must be placed on a tr element.");
			}

			var expandingRowLinker = $compile(expandingRowMarkup);

			return function(scope, element, attrs, controller) {
				scope.$watch("rowData", function () {
					controller.resetViewModel();
				});

				scope.view = attrs.initialView;

				// angular templates can't have several top-level elements (also TR can't be a template root),
				// so we need to insert another row here during linking
				expandingRowLinker(scope, function (clone) {
					element.after(clone);
				});
			};
		}
	};
});
