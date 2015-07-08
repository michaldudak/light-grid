if (typeof ($) === "undefined") {
	throw new Error("Light Grid requires jQuery.");
}

if (angular.element !== $) {
	throw new Error("jQuery must be included before Angular.");
}

angular.module("lightGrid", []).constant("DEFAULT_VIEW", "read");
