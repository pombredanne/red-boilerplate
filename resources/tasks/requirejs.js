/*global module:false*/
module.exports = function(grunt) {

	grunt.config.set("requirejs", {
		desktop: {
			mainConfigFile: "project/static/js/config.js",
			include: ["config.js"],
			paths: {
				"jquery": "empty:"
			},
			optimize: "uglify",
			out : "project/static/js/site.min.js",
			name : grunt.task.directive("<config:meta.projectName>") + "/site",
			skipModuleInsertion : true
		}
	});

	grunt.config.set("build.requirejs", "requirejs");
};
