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
			"src/**/moduleDefinition.js",
			"src/common.js",
			"src/**/*.js",
			"test/unit/**/*.js",
			"test/integration/**/*.js"
		]
	});
};
