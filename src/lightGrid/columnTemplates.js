/**
 * Dummy directive to be placed on a row containing column templates
 * (when writing HTML-compliant markup)
 *
 * Example:
 *   <table data-light-grid id="sampleGrid" data-data="people">
 *     <tr data-column-templates>
 *       <td data-lg-column title="'First name'">{{rowData.firstName}}</td>
 *       <td data-lg-column title="'Last name'">{{rowData.lastName}}</td>
 *     </tr>
 *   </table>
 */
angular.module("lightGrid").directive("lgColumnTemplates", function () {
	"use strict";

	return {
		restrict: "A",
		link: function (scope, element) {
			var parent = element.parent();
			// browsers may create additional tbody tag surrounding the <td lg-column-templates">. We don't need this.
			if (parent[0].tagName === "TBODY" && parent.children().length === 1) {
				parent.remove();
			} else {
				element.remove();
			}
		}
	};

});
