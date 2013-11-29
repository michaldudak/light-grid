/* global grid */

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
grid.module.directive("lgColumnTemplates", function () {
	"use strict";

	return function (scope, element) {
		element.remove();
	};
});