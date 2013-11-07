grid.module.directive("templateColumn", ["$compile", function ($compile) {
	return {
		scope: {
			property: "@",
			title: "="
		},
		restrict: "EA",
		require: "^lightGrid",
		replace: true,
		controller: ["$scope", function($scope) {
			var templateColumnController = {};

			$scope.views = {};

			templateColumnController.registerView = function(name, viewRenderer) {
				$scope.views[name || "*"] = viewRenderer;
			};

			return templateColumnController;
		}],
		link: function(scope, instanceElement, instanceAttrs, gridController) {
			instanceElement.remove();
			gridController.defineColumn({
				cellRenderer: function(rowScope) {
					
					var switchRoot = angular.element("<div ng-switch='view' />");
						
					for (var availableView in scope.views) {
						if (scope.views.hasOwnProperty(availableView) && availableView !== "*") {
							var viewRenderer = scope.views[availableView];
							var switchElement = angular.element("<div ng-switch-when='" + availableView + "' />");
							switchElement.append(viewRenderer ? viewRenderer(rowScope) : "");

							switchRoot.append(switchElement);
						}
					}
						
					if (scope.views["*"]) {
						var defaultElement = angular.element("<div ng-switch-default />");
						defaultElement.append(scope.views["*"](rowScope));

						switchRoot.append(defaultElement);
					}

					$compile(switchRoot)(rowScope);

					return switchRoot;
				},
				headerRenderer: function() {
					return scope.title;
				},
				footerRenderer: null
			});
		}
	};
}]);