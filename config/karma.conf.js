/* global module */

module.exports = function (config) {
	config.set({
		basePath: "..",
		singleRun: false,
		autoWatch: true,

		frameworks: ["jasmine"],
		
		browsers: ["PhantomJS"],

		files: [
			"libs/jquery*.js",
			"libs/angular*.js",
			"dist/angular-grid*.js",
			"test/**/*.js"
		]
	});
};