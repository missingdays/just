var fs = require("fs");
var path = require("path");
var logger = require("ed3-logger");
var glob = require("glob");
var mkdirp = require("mkdirp");

var jstp = require("../parser/jst/index");
var tojs = require("../compiler/tojs/index");

var files = {};

files.process = function(from, to){

    glob("**/*.jst", function(err, f){
        f.forEach(function(file){
            var newName = files._changeExtension(file);
            newName = files._changeDir(newName, { from: from, to: to });

            files.mkdirFor(newName);

            file = path.resolve(file);
            files.convertFile(file, function(converted){
                fs.writeFile(newName, converted, function(err){
                    if(err) logger.log(err);
                });
            });
        });
    });
};

files.convert = function(code){
    var ast = jstp.parse(code, {
        attachComment: true
    });
    var code = tojs.generate(ast, {
        comment: true
    });
    return code;
};

files.convertFile = function(file, callback){
    fs.readFile(file, "utf-8", function(err, code){
        callback(files.convert(code));
    });
};

files.mkdirFor = function(file){
    var tmp = file.split("/");
    tmp.pop();
    var dir = tmp.join("/");
    mkdirp(dir);
};

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
};

module.exports = files;
