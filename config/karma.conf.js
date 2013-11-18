/* global module */

module.exports = function (config) {
	config.set({
		basePath: "..",
		singleRun: false,
		autoWatch: true,

		frameworks: ["jasmine"],
		
		browsers: ["Chrome", "Firefox", "PhantomJS"],

		files: [
			"libs/jquery*.js",
			"libs/angular*.js",
			"dist/light-grid-0.1.0.js",
			"test/lib/angular-mocks.js",
			"test/unit/*.js"
		]
	});
};