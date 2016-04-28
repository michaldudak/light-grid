/* global module */

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		concat: {
			options: {
				separator: "\n\n",
				banner: "/*!\n "+
					"Light Grid <%= pkg.version %> \n\n " +
					"by <%= pkg.author %>\n " +
					"<%= pkg.repository.url %>\n " +
					"license: <%= pkg.license %>\n\n " +
					"build date: <%= new Date().toISOString() %>\n" +
					"*/\n\n" +
					"(function (window, angular) {\n\n",
				footer: "\n\n}(window, window.angular));",
				stripBanners: true
			},
			dist: {
				src: [
					"src/lightGrid/moduleDefinition.js",
					"src/*.js",
					"src/lightGrid/*.js",
					"src/lightGridDataProviders/moduleDefinition.js",
					"src/lightGridDataProviders/*.js",
					"src/lightGridControls/moduleDefinition.js",
					"src/lightGridControls/*.js"
				],
				dest: "dist/light-grid.js"
			}
		},
		uglify: {
			dist: {
				options: {
					sourceMap: true,
					mangle: true,
					compress: {
						drop_console: true
					},
					preserveComments: "some"
				},
				files: {
					"dist/light-grid.min.js": ["dist/light-grid.js"]
				}
			}
		},
		karma: {
			options: {
				configFile: "config/karma.conf.js"
			},
			singleRun: {
			},
			continuous: {
				singleRun: false,
				background: true
			},
			ci: {
				browsers: ["PhantomJS"]
			}
		},
		watch: {
			check: {
				files: ["src/**/*.js", "test/**/*.js"],
				tasks: ["code-check", "concat", "karma:continuous:run"]
			}
		},
		ngAnnotate: {
			bundle: {
				src: ["dist/light-grid.js"],
				expand: true,
				ext: ".js",
				extDot: "last"
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			beforeConcat: {
				src: ["src/**/*.js", "test/**/*.js"]
			},
			afterConcat: {
				src: ["dist/light-grid.js"]
			}
		},
		jscs: {
			default: {
				files: {
					src: ["src/**/*.js", "test/**/*.js"]
				},
				options: {
					config: ".jscsrc"
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-karma");
	grunt.loadNpmTasks("grunt-jscs");
	grunt.loadNpmTasks("grunt-ng-annotate");

	grunt.registerTask("sanity-check", ["karma:continuous:start", "watch:check"]);
	grunt.registerTask("code-check", ["jscs", "jshint:beforeConcat"]);
	grunt.registerTask("build", ["code-check", "concat", "jshint:afterConcat", "ngAnnotate", "uglify"]);
	grunt.registerTask("test", ["build", "karma:singleRun"]);
	grunt.registerTask("ci", ["build", "karma:ci"]);
	grunt.registerTask("default", "test");
};
