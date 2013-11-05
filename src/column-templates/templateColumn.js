(function (window, ng) {
	"use strict";

	window.angularGrid.module.directive("templateColumn", function () {
		return {
			scope: {
				property: "@",
				title: "="
			},
			restrict: "EA",
			require: "^grid",
			transclude: true,
			compile: function (templateElement, templateAttrs, linker) {
				return function(scope, instanceElement, instanceAttrs, gridController) {
					instanceElement.remove();
					gridController.defineColumn({
						cellRenderer: function (rowScope) {
							var renderedRow;
							linker(rowScope, function (clone) {
								renderedRow = clone;
							});
							
							return renderedRow;
						},
						headerRenderer: function () {
							return scope.title;
						},
						footerRenderer: null
					});
				};
			}
		};
	});

}(window, window.angular));