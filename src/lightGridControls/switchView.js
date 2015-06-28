/**
 * Allows to change a view mode of the row.
 * Can only be used as an attribute. Its value specifies name of the target view mode.
 */
angular.module("lightGridControls").directive("lgSwitchView", function () {
	"use strict";

	return {
		require: "^?lgRow",
		link: function (scope, elem, attrs, rowController) {
			var viewName = attrs.lgSwitchView;

			elem.on("click", function () {
				rowController.switchView(viewName);

				if (!scope.$$phase) {
					scope.$apply();
				}
			});
		}
	};
});
