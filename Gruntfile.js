/* global module*/

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				separator: "\n\n;",
			},
			dist: {
				src: [
					"src/tableRendering.js",
					"src/controller.js",
					"src/directiveDefinition.js",
					"src/angular-grid.js",
					"src/angular-bound-column.js",
					"src/angular-static-column.js",
					"src/angular-custom-column.js",
					"src/template-column.js"
				],
				dest: 'dist/angular-grid-<%= pkg.version %>.js',
			}
		},
		karma: {
			unit: {
				configFile: "config/karma.conf.js",
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-karma");
};