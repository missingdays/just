function parse(file){
    file.replace("/fun\s/g", "function");
    return file;
}

module.exports = {
    parse: parse
}
