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
					$scope.row.expanded = !$scope.row.expanded;
				});
			});
		}
	};
});