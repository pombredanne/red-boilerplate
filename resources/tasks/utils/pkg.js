/*jslint node: true */
/*global jake, desc, task */
var fs = require("fs");

var pkgFile = process.cwd() + "/package.json";
var pkg = JSON.parse(fs.readFileSync(pkgFile, "utf-8"));

pkg.save = function () {
	"use strict";

	var obj = {};
	for (var prop in this) {
		if (prop !== "save") {
			obj[prop] = this[prop];
		}
	}

	fs.writeFileSync(pkgFile, JSON.stringify(obj, null, "\t"));
};

module.exports = pkg;
