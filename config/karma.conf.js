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
			"src/moduleDefinition.js",
			"src/**/*.js",
			"test/lib/angular-mocks.js",
			"test/resources/markup.js",
			"test/unit/*.js"
		]
	});
};