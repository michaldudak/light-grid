/**
 * Directive persisting data from the viewModel of the row.
 */
angular.module("lightGridControls").directive("lgPersistData", function ($q) {
	"use strict";

	return {
		restrict: "A",
		link: function persistDataLink($scope, $elem, $params) {
			$elem.on("click", function () {
				var dataProvider = $scope.$eval($params.provider);
				var rowController = $scope.row.controller;
				
				$q.when(dataProvider.saveModel($scope.viewData))
					.then(function () {
						if (rowController) {
							rowController.acceptViewModel();
							rowController.switchView("read");
						}
					});
			});
		}
	};
});
