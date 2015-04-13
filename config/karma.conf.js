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
			"dist/light-grid.js",
			"test/lib/angular-mocks.js",
			"test/unit/*.js"
		]
	});
};
