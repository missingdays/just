var esprima = require("esprima");

module.exports.parse = function(code){
    return esprima.parse(code);
}
