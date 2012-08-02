module.exports = function (grunt) {

	var fs = require("fs"),
	jshint = require("jshint").JSHINT,
	config = require("../config/jshint.config.js"),
	jshintOptions = config.jshint,
	include = config.include,
	exclude = config.exclude;

	function isOkay(file, include, exclude) {
		var ok = false,
			re;

		for (var i = 0; i < include.length; i ++) {
			re = include[i];
			if (re.test(file)) {
				ok = true;
				break;
			}
		}
		for (i = 0; i < exclude.length; i ++) {
			re = exclude[i];
			if (re.test(file)) {
				ok = false;
				break;
			}
		}
		return ok;
	}

	function getJSFiles(folder) {

		var dirStats = fs.statSync(folder);
		var jsFiles = [];

		if (dirStats.isDirectory()) {

			var files = fs.readdirSync(folder);

			for (var i = 0; i < files.length; i ++) {

				var file = files[i];

				if (isOkay(folder + "/" + file, include, exclude)) {
					jsFiles.push(folder + "/" + file);
				} else {
					jsFiles = jsFiles.concat(getJSFiles(folder + "/" + file));
				}

			}

			return jsFiles;
		}

		return [];
	}

	function pad(str, len, padChar) {

		str = str.toString();

		if (typeof padChar === "undefined") {
			padChar = " ";
		}

		while (str.length < len) {
			str = padChar + str;
		}
		return str;
	}

	function trim(str) {
		str = str.replace(/^\s\s*/, '');
		var	ws = /\s/,
			i = str.length - 1;

		while (ws.test(str.charAt(i))) {
			i = i - 1;
		}
		return str.slice(0, i + 1);
	}

	grunt.registerTask("jshint", "JSHint your JavaScript.", function () {

		var done = this.async();

		var hasErrors = false;
		var files = getJSFiles(process.cwd() + ["", "project", "static", "js"].join("/"));

		for (var i = 0; i < files.length; i ++) {
			var file = files[i];
			var fa = file.split("/");
			fa[fa.length-1] = fa[fa.length-1].white.bold;
			var filename = fa.join("/").grey.bold;

			var contents = fs.readFileSync(file, 'utf-8');

			if (!jshint(contents, jshintOptions)) {
				hasErrors = true;

				grunt.log.writeln();
				grunt.log.writeln(filename + pad("", 106-file.length, ".") + "ERRORS".red);
				grunt.log.writeln();

				for (var j = 0; j < jshint.errors.length; j ++) {
					var err = jshint.errors[j],
						line = ["line", pad(err.line, 3, " "), ": char", pad(err.character, 3, " "), "  "].join(" ").grey.bold,
						reason = err.reason.yellow.bold;

					grunt.log.writeln(pad("", 20) + line + reason);
					grunt.log.writeln(pad("", 42) + trim(err.evidence).white);
					grunt.log.writeln();
				}
			}

			else {
				grunt.log.writeln(filename + pad("", 110-file.length, ".") + "OK".green);
			}
		}

		done(!hasErrors);
	});
}