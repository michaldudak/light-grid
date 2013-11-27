/* global grid */

/**
 * Provides methods exposing grid controllers to other elements on a page.
 */
grid.module.service("lgGridService", [function gridService() {
	"use strict";
	
	var grids = {};
	var dataProviders = {};
	
	/**
	 * Gets the controller of the grid with a given ID.
	 *
	 * @param {String} id - ID of the grid.
	 * @returns {Object} Grid controller
	 */
	this.getGridController = function getGridController(id) {
		return grids[id];
	};
	
	/**
	 * Gets the data provider of the grid with a given ID.
	 * @param {String} id - ID of the grid.
	 * @returns {Object} Data provider of the grid.
	 */
	this.getDataProvider = function getDataProvider(id) {
		return dataProviders[id];
	};
	
	/**
	 * Registers the grid in the service.
	 * This method is not intended for public use.
	 *
	 * @param {String} id - ID of the grid
	 * @param {Object} controller - Controller to register.
	 * @private
	 */
	this.registerGrid = function registerGrid(id, controller) {
		grids[id] = controller;
	};
	
	/**
	 * Unregisters the grid from the service.
	 * This method is not intended for public use.
	 *
	 * @param {String} id - ID of the grid
	 * @private
	 */
	this.unregisterGrid = function unregisterGrid(id) {
		delete grids[id];
	};
	
	/**
	 * Registers the data provider in the service.
	 * This method is not intended for public use.
	 *
	 * @param {String} id - ID of the grid
	 * @param {Object} controller - Data provider controller to register.
	 * @private
	 */
	this.registerDataProvider = function registerDataProvider(id, controller) {
		dataProviders[id] = controller;
	};
	
	/**
	 * Unregisters the data provider of a grid with a given ID from the service.
	 * This method is not intended for public use.
	 *
	 * @param {String} id - ID of the grid
	 * @private
	 */
	this.unregisterGrid = function unregisterGrid(id) {
		delete dataProviders[id];
	};
}]);