/* global grid */

grid.module.service("lgGridService", function gridService() {
	"use strict";

	var grids = {};
	var dataProviders = {};

	this.registerGrid = function registerGrid(id, controller) {
		grids[id] = controller;
	};

	this.unregisterGrid = function unregisterGrid(id) {
		delete grids[id];
	};

	this.getGridController = function getGridController(id) {
		return grids[id];
	};

	this.registerDataProvider = function registerDataProvider(id, controller) {
		dataProviders[id] = controller;
	};

	this.getDataProvider = function getDataProvider(id) {
		return dataProviders[id];
	};
});