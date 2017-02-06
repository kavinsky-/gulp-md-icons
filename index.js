'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var async = require('async');
var PLUGIN_NAME = 'gulp-md-icons';

module.exports = function (options) {
	var options = options || {};
	var icons;

	options.src = options.src || 'node_modules/material-design-icons';

	var reduceIcons = function (res, attr) {
		var iconName;
		var iconsSetName;
		var iconPath;
		var iconFile;
		
		if(attr.includes("=")){
			attr = attr.split('=');
		} else {
			attr = attr.split(': ');
		}
		
		console.log(attr);
		
		attr[1] = attr[1].replace(new RegExp('"', 'ig'), '').split('-');

		iconName = attr[1][1];
		iconFile = ['ic', iconName, '24px.svg'].join('_');
		iconsSetName = attr[1][0];
		iconPath = [options.src, iconsSetName, 'svg', 'production', iconFile].join('/');

		if(iconsSetName && iconName && iconsSetName.substr(0, 2) !== '{{' && iconName.substr(iconName.length - 2, 2) !== '}}') {
			res.push({
				name: iconName,
				file: iconFile,
				path: iconPath,
				set: iconsSetName
			});
		}

		return res;
	};

	var extractIcons = function (fileContent) {
		var regExp1 = /(md|ne)-svg-icon=("[^<>"]*"|'[^<>']*'|\w+)/ig;
		var regExp2 = /icon:\s("[^<>"]*"|'[^<>']*'|\w+)/ig;
		var result = (fileContent.match(regExp1) || []).concat((fileContent.match(regExp2) || []));
		
		if (!result) {
			return [];
		}

		return result.reduce(reduceIcons, []);
	};

	var iconsLookup = function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return;
		}

		try {
			icons = icons.concat(extractIcons(file.contents.toString()));
		} catch (err) {
			this.emit('error', new gutil.PluginError(PLUGIN_NAME, err));
		}
		cb();
	};

	var attachIconsToStream = function (cb) {
		var self = this;
		var config = {};
		async.each(icons, function (icon, cb) {
			var params = {
				base: './',
				cwd: process.cwd(),
				path: icon.set + '/' + icon.file
			};

			if (options.config && options.config.iconsPath) {
				config[[icon.set, icon.name].join(':')] = options.config.iconsPath + '/' + params.path;
			}

			fs.readFile(icon.path, function (err, data) {
				if (err) {
					cb(err);
					return;
				}
				var file = new gutil.File(params);
				file.contents = data;
				self.push(file);
				cb();
			});
		}, function () {
			if (options.config && options.config.iconsPath) {
				var configContent = {};

				Object.keys(config).forEach(function (k) {
					var row = {};
					configContent[k] = config[k];
				});
				fs.writeFile(options.config.file, JSON.stringify(configContent, null, 2), {encoding: 'utf8'}, function () {
					cb();
				});
			}
			else {
				cb();
			}
		});
	};
	icons  = Object.keys(options.defaults || {}).map(function(i) {
		return '=' + i;
	}).reduce(reduceIcons, []);
	return through.obj(iconsLookup, attachIconsToStream);
};
