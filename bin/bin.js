#!/usr/bin/env node

var fs = require('fs')
var program = require('commander')
var readline = require('readline')
var fileinfo = require('fileinfo')

var pkg = require('../package.json')

var version = pkg.version

around(program, 'optionMissingArgument', function (fn, args) {
	program.outputHelp()
	fn.apply(this, args)
	return { args: [], unknown: [] }
})

before(program, 'outputHelp', function () {
	this._helpShown = true
})

before(program, 'unknownOption', function () {
	this._allowUnknownOption = this._helpShown

	if (!this._helpShown) {
		program.outputHelp()
	}
})

program
	.version(version, '    --version')
	.usage('[filepath]')
	.parse(process.argv)

main()

/**
 * Install an around function; AOP.
 */

function around(obj, method, fn) {
	var old = obj[method]

	obj[method] = function () {
		var args = new Array(arguments.length)
		for (var i = 0; i < args.length; i++) args[i] = arguments[i]
		return fn.call(this, old, args)
	}
}

/**
 * Install a before function; AOP.
 */

function before(obj, method, fn) {
	var old = obj[method]

	obj[method] = function () {
		fn.call(this)
		old.apply(this, arguments)
	}
}

function main() {
	var fs = require("fs");
	try {
		var fileBuf = fs.readFileSync(program.args[0]);
		fileinfo(program.args[0]).then(function (mime, type, extension) {
			let _mime = mime.type == "font"?"font/truetype;charset=utf-8":mime.mime;
			console.log("data:" + _mime + ";base64," + fileBuf.toString("base64"));
		}, function () { })
	} catch (e) {
		console.error("please check file path ...");
		program.outputHelp()
	}
}