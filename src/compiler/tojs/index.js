var escodegen = require("escodegen");

module.exports.generate = function(ast){
    return escodegen.generate(ast);
}
