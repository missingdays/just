var flags = require("flags");
var files = require("./files/files.js");

var args = process.argv;

files.process(args[2], args[3]);
