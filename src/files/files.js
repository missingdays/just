var fs = require("fs");
var logger = require("ed3-logger");

var parser = require("../parser/parser.js");

function parseFile(fileName, callback){
    fs.readFile(fileName, { encoding: 'utf8' }, function(err, data){

        var parsedFile = parser.parse(data);

        if(callback){
            callback(parsedFile);
        }
    });
}

function changeExtension(fileName){
    var arr = fileName.split(".");

    var ext = arr[arr.length-1];

    if(ext === "jst"){
        ext = "js"
    }

    arr[arr.length-1] = ext;

    return arr.join(".");
}

function parse(fileName){

    fs.mkdir("lib", function(err){});

    fs.stat(fileName, function(err, file){
        if(file.isFile()){

            parseFile(fileName, function(parsedFile){

                fileName = changeExtension(fileName);

                fs.writeFile(fileName, parsedFile, function(err){
                    if(err)
                        logger.log(err);
                });
            });
        }
    });
}

module.exports = {
    parse: parse
}
