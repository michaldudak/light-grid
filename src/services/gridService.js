/* global grid */

grid.module.service("lgGridService", [function gridService() {
	"use strict";

	var grids = {};

	this.registerGrid = function registerGrid(id, controller) {
		grids[id] = controller;
	};

	this.unregisterGrid = function unregisterGrid(id) {
		delete grids[id];
	};

	this.getGridController = function getGridController(id) {
		return grids[id];
	};
}]);