var escodegen = require("escodegen");

module.exports.generate = function(ast, options){
    return escodegen.generate(ast, options);
}
