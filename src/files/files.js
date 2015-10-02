var fs = require("fs");
var path = require("path");
var logger = require("ed3-logger");

var jstp = require("../parser/jst");
var tojs = require("../compiler/tojs");

var files = {};

files._parseFile = function(fileName, callback){
    fs.readFile(fileName, { encoding: 'utf8' }, function(err, data){

        var parsedFile = jstp.parse(data);

        if(callback){
            callback(parsedFile);
        }
    });
}

files._changeExtension = function(fileName){
    var arr = fileName.split(".");

    var ext = arr[arr.length-1];

    if(ext === "jst"){
        ext = "js"
    }

    arr[arr.length-1] = ext;

    return arr.join(".");
}

function removePrePostFixes(path){
    if(!path[0]) path.shift();
    if(path.length > 0 && !path[path.length-1]) path.pop();
    return path;
}

files._changeDir = function(file, options){
    var self = this;

    var splt = file.split("/");

    if(splt.length < 2){
        return path.normalize(file);
    }

    var options = options || {};

    var from = options.from || self.from || "jst";
    var to = options.to || self.to || "js";

    from = from.split("/");
    to = to.split("/");

    from = removePrePostFixes(from);
    to = removePrePostFixes(to);

    for(var i = 0; i < from.length; i++){
        var subs = splt[i];
        if(!subs){
            throw new Error("Can't parse path " + file);
        }

        if(subs == from[i]){
            splt[i] = to[i];
        } else {
            throw new Error("Can't convert " + file + " with given prefix " + from);
        }
    }

    return path.normalize(splt.join("/"));
}

files.parse = function(fileName, to){

    fs.stat(fileName, function(err, file){
        if(file.isFile()){

            files._parseFile(fileName, function(parsedFile){

                fileName = files._changeExtension(fileName);
                fileName = files._changeDir(fileName);

                var code = tojs.gen_code(parsedFile, { beautify: true });

                fs.writeFile(fileName, code, function(err){
                    if(err){
                        logger.log(err);
                    }

                });
            });
        } else {
            fs.readdir(fileName, function(err, dirs){
                dirs.forEach(function(file){
                    files.parse(fileName + "/" + file);
                });
            });
        }
    });

}

module.exports = files;
