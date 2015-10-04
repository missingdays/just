var escodegen = require("escodegen");

module.exports.gen = function(ast){
    return escodegen.generate(ast);
}
