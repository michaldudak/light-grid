/* global grid */

grid.module.directive("lgColumn", function () {
	"use strict";

	return {
		scope: {
			title: "=",
			visible: "="
		},
		restrict: "EA",
		require: "^lightGrid",
		transclude: true,
		controller: ["$scope", function ($scope) {
			var templateColumnController = {};

			$scope.views = {};
			$scope.viewCount = 0;
			$scope.headerTemplate = null;
			$scope.footerTemplate = null;

			templateColumnController.registerView = function (name, viewLinker) {
				name = name || "*";
				var separatedNames = name.split(",");

				for (var i = 0; i < separatedNames.length; ++i) {
					var separatedName = separatedNames[i].trim();
					if (separatedName === "") {
						continue;
					}

					$scope.views[separatedName] = viewLinker;
					$scope.viewCount += 1;
				}
			};

			templateColumnController.registerHeaderTemplate = function (viewLinker) {
				$scope.headerTemplate = viewLinker;
			};

			templateColumnController.registerFooterTemplate = function (viewLinker) {
				$scope.footerTemplate = viewLinker;
			};

			return templateColumnController;
		}],
		controllerAs: "templateColumnController",
		compile: function (tElem, tAttr, linker) {
			return function (scope, instanceElement, instanceAttrs, gridController) {

				if (scope.visible !== false) {
					linker(scope, function (clone) {
						instanceElement.append(clone);
					});

					if (scope.viewCount === 0) {
						scope.templateColumnController.registerView("*", linker);
					}

					gridController.defineColumn({
						title: scope.title,
						views: scope.views,
						headerTemplate: scope.headerTemplate,
						footerTemplate: scope.footerTemplate,
						attributes: instanceAttrs
					});
				}

				instanceElement.remove();
			};
		}
	};
});