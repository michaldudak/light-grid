/* global module */

module.exports = function (config) {
	config.set({
		basePath: "..",
		singleRun: true,
		autoWatch: false,

		frameworks: ["jasmine"],
		
		browsers: ["PhantomJS"],

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