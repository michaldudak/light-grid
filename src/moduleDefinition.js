if (typeof ($) === "undefined") {
	throw new Error("Light Grid requires jQuery.");
}
	
if (angular.element !== $) {
	throw new Error("jQuery must be included before Angular.");
}

var grid = {
	module: angular.module("light-grid", [])
};