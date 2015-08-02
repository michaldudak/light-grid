/* global getBlockNodes */

angular.module("lightGridControls").directive("lgExpandedRow", function ($animate) {
	"use strict";

	/* Code based on Angular's ngIf directive: https://github.com/angular/angular.js/blob/master/src/ng/directive/ngIf.js */
	return {
		multiElement: true,
		transclude: "element",
		priority: 600,
		terminal: true,
		restrict: "A",
		require: "^?lgRow",
		$$tlb: true,
		link: function lgExpandedRowLink ($scope, $element, $attr, ctrl, $transclude) {
			var block;
			var childScope;
			var previousElements;
			
			$scope.$watch("row.expanded", function lgExpandedRowWatchAction(shouldBeVisible) {
				if (shouldBeVisible) {
					if (!childScope) {
						$transclude(function(clone, newScope) {
							childScope = newScope;
							clone[clone.length++] = document.createComment(" end lgExpandedRow ");
							// Note: We only need the first/last node of the cloned nodes.
							// However, we need to keep the reference to the jqlite wrapper as it might be changed later
							// by a directive with templateUrl when its template arrives.
							block = {
								clone: clone
							};
							
							$animate.enter(clone, $element.parent(), $element);
						});
					}
				} else {
					if (previousElements) {
						previousElements.remove();
						previousElements = null;
					}
					
					if (childScope) {
						childScope.$destroy();
						childScope = null;
					}
					
					if (block) {
						previousElements = getBlockNodes(block.clone);
						$animate.leave(previousElements).then(function () {
							previousElements = null;
						});
						
						block = null;
					}
				}
			});
		}
	};
});