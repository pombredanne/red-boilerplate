/*global module:false*/
module.exports = function (grunt) {

	grunt.registerTask("oxblood", "Run Rosy + Mocha unit tests", function (mode) {
		var cp = require("child_process");
		var runner = "test/runner.js";

		if (!fs.existsSync(runner)) {
			console.error("OxBlood not found.");
			process.exit();
		}

		var child = cp.spawn("node", [runner, "-m", mode], {
			env: null,
			setsid: true,
			stdio: "inherit"
		});

		child.addListener("exit", function () {
			process.exit();
		});
	});

};
