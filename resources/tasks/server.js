module.exports = function(grunt) {
	var fs = require("fs");
	var cp = require("child_process");
	var path = require("path");

	grunt.registerTask("server", "An alias for Python's runserver", function () {
		var args = grunt.utils.toArray(arguments);
		var done = this.async();

		var port = (args[1] || args[0]);
		var ip = (args[1] ? args[0] : null);
		var cmd = (ip || "0.0.0.0") + ":" + (port || "8000");

		var activate = path.join("env", "bin", "activate");
		var setup = path.join("scripts", "setup.sh");
		var manager = path.join("project", "manage.py");

		var child;

		var runServer = function () {
			if (fs.existsSync(manager)) {
				child = cp.spawn("python", [manager, "runserver", cmd], {
					cwd: process.cwd(),
					env: null,
					setsid: true,
					stdio: "inherit"
				});

				child.addListener("exit", function (code) {
					done(!!!code);
				});
			} else {
				console.error("Can't find %s. Aborting.".replace("%s", activate));
				process.exit();
			}
		};

		var activateProject = function () {
			if (fs.existsSync(activate)) {
				child = cp.spawn("source", [activate], {
					stdio: "inherit"
				});

				child.addListener("exit", runServer);
			} else {
				console.error("Can't find %s. Aborting.".replace("%s", activate));
				process.exit();
			}
		};

		var setupProject = function () {
			if (fs.existsSync(setup)) {
				child = cp.spawn("sh", [setup], {
					stdio: "inherit"
				});

				child.addListener("exit", activateProject);
			} else {
				console.error("No setup script found. Aborting.");
				process.exit();
			}
		};

		if (!fs.existsSync(activate)) {
			setupProject();
		} else {
			activateProject();
		}
	});

};
