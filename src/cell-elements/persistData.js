/**
 * Directive persisting data from the viewModel of the row.
 */
angular.module("light-grid").directive("persistData", function ($q) {
	"use strict";

	return {
		link: function ($scope, $elem, $params) {
			$elem.on("click", function () {

				var dataProvider = $scope.$eval($params.provider);

				$q.when(dataProvider.saveModel($scope.viewData))
					.then(function () {
						$scope.rowController.acceptViewModel();
						$scope.rowController.switchView("read");
					});
			});
		}
	};
});
