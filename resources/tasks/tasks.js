module.exports = function(grunt) {

	grunt.registerTask("tasks", "List all tasks", function () {

		var done = this.async();
		var path = require('path');
		var hasInitialized;

		grunt.helper("check_initialized", function (initialized) {
			hasInitialized = initialized;

			if (!initialized) {
				grunt.task.run("start");
			}
		});

		// Initialize task system so that the tasks can be listed.
		grunt.task.init([], {help: true});

		// Build 2-column array for table view.
		var col1len = 0;
		var opts = Object.keys(grunt.cli.optlist).map(function(long) {
			var o = grunt.cli.optlist[long];
			var col1 = '--' + (o.negate ? 'no-' : '') + long + (o.short ? ', -' + o.short : '');
			col1len = Math.max(col1len, col1.length);
			return [col1, o.info];
		});

		var tasks = Object.keys(grunt.task._tasks).map(function(name) {
			var arr = [];
			col1len = Math.max(col1len, name.length);
			var info = grunt.task._tasks[name].info;
			if (grunt.task._tasks[name].multi || name === "watch") {
				info += ' *';

				var config = grunt.config.get([name]);
				if (config) {
					arr.push(config);

					for (var key in config) {
						col1len = Math.max(col1len, (name + ":" + key).length);
					}
				} else {
					arr.push("none");
				}
			}
			return [name, info].concat(arr);
		});

		// Widths for options/tasks table output.
		var widths = [1, col1len, 2, 76 - col1len];

		grunt.log.writeln("");
		tasks.forEach(function(a) {
			var b = a[0].split(":"),
				c = a[1],
				opts = a[2];


			if (b.length > 1) {
				b[0] = b[0].grey;
				b[1] = b[1].white;
			}

			b = b.join(":");

			if (hasInitialized && b !== "tasks" && (!opts || opts !== "none")) {
				grunt.log.writetableln(widths, ['', grunt.utils._.pad(b.white, col1len - 1), '', c.cyan]);

				if (opts) {
					for (var key in opts) {
						if (key !== "" && opts.hasOwnProperty(key)) {
							grunt.log.writetableln(widths, ['', grunt.utils._.pad(b.grey + (":" + key).white, col1len), '', '']);
						}
					}
				}
			}
		});
		grunt.log.writeln("");

		done();
	});

};
