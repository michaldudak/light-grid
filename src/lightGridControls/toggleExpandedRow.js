/**
 * Opens or closes the expanded view of the row.
 * This can be only used as an attribute. Its value specifies the name of the template
 * used as an expanded row content.
 */
angular.module("lightGridControls").directive("lgToggleExpandedRow", function ($timeout) {
	"use strict";

	return {
		require: "^?lgRow",
		restrict: "A",
		link: function toggleExpandedRowLink($scope, $elem) {

			$elem.on("click", function () {
				$timeout(function () {
					$scope.$broadcast("toggleExpandedRow");
				});
			});
		}
	};
});

angular.module("lightGridControls").directive("lgExpandedRow", function () {
	"use strict";

	return {
		link: function expandedRowLink($scope, $elem) {
			var isVisible = false;

			function show() {
				$elem.removeClass("ng-hide");
				isVisible = true;
			}

			function hide() {
				$elem.addClass("ng-hide");
				isVisible = false;
			}

			$scope.$on("toggleExpandedRow", function() {
				if (isVisible) {
					hide();
				} else {
					show();
				}
			});

			hide();
		}
	};
});