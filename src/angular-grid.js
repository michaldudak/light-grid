/*

Angular Grid
  by Digital Creations

Currently supported properties in column definitions:
- cellRenderer(rowData, rowId)
- headerRenderer()
- footerRenderer()

*/

(function (window, ng, $) {
	"use strict";
	
	if (typeof($) === "undefined") {
		throw new Error("Angular Grid requires jQuery.");
	}
	
	if (ng.element !== $) {
		throw new Error("jQuery must be included before Angular.");
	}
	
}(window, window.angular, window.jQuery));