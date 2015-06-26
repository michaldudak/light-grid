/* global module */

module.exports = function (config) {
	config.set({
		basePath: "..",
		singleRun: true,
		autoWatch: false,

		frameworks: ["jasmine"],

		reporters: ["mocha"],

		browsers: ["PhantomJS", "Chrome", "Firefox"],

		files: [
			"libs/jquery.js",
			"libs/angular.js",
			"libs/angular-mocks.js",
			"dist/light-grid.js",
			"test/unit/**/*.js"
		]
	});
};
