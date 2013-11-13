grid.module.directive("persistData", ["$q", "$rootScope", function($q, $rootScope) {
	return {
		priority: 10,
		link: function (scope, elem) {
			elem.on("click", function () {

				$q.when(scope.gridController.getDataProvider().updateRecords(scope.viewData))
					.then(function () {
						scope.rowController.acceptViewModel();
						scope.rowController.switchView("read");

						if (!scope.$$phase && !$rootScope.$$phase) {
							scope.$apply();
						}
					});
			});
		}
	};
}]);