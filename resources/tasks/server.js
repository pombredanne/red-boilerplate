module.exports = function(grunt) {
	var cp = require("child_process");
	var path = require("path");

	grunt.registerTask("server", "An alias for Python's runserver", function () {
		var args = grunt.utils.toArray(arguments);
		var done = this.async();

		var port = (args[1] || args[0]);
		var ip = (args[1] ? args[0] : null);
		var cmd = (ip || "0.0.0.0") + ":" + (port || "8000");

		var child = cp.spawn("python", [path.join("project", "manage.py"), "runserver", cmd], {
			cwd: process.cwd(),
			env: null,
			setsid: true,
			stdio: "inherit"
		});

		child.addListener("exit", function (code) {
			done(!!!code);
		});
	});

};
