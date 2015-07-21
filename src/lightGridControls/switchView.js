/**
 * Allows to change a view mode of the row.
 * Can only be used as an attribute. Its value specifies name of the target view mode.
 */
angular.module("lightGridControls").directive("lgSwitchView", function ($timeout) {
	"use strict";

	return {
		require: "^lgRow",
		restrict: "A",
		link: function switchViewLink(scope, elem, attrs) {
			var viewName = attrs.lgSwitchView;

			elem.on("click", function () {
				$timeout(function () {
					scope.row.controller.switchView(viewName);
				});
			});
		}
	};
});
