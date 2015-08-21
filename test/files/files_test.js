/*
 * files_test.js
 * Copyright (C) 2015 missingdays <missingdays@missingdays>
 *
 * Distributed under terms of the MIT license.
 */

var expect = require("expect.js");

var files = require("../../src/files/files");

describe("Files", function(){
    describe("#changeExtension", function(){
        var test = {
            hard: {}
        };
        beforeEach(function(){
            test.js = "test.js";
            test.jst = "test.jst";
            test.hard.js = "big.string.Hello.js.js";
            test.hard.jst = "big.string.Hello.js.jst";
        });

        it("should not change .js extention", function(){
            var s = files._changeExtension(test.js);

            expect(s).to.eql(test.js);
        });

        it("should change .jst extention to .js", function(){
            var s = files._changeExtension(test.jst);

            expect(s).to.eql(test.js);
        });

        it("should not change even hard .js", function(){
            var s = files._changeExtension(test.hard.js);

            expect(s).to.eql(test.hard.js);
        });

        it("should change even hard .jst", function(){
            var s = files._changeExtension(test.hard.jst);

            expect(s).to.eql(test.hard.js);
        });
    });

    describe("#changeDir", function(){
        it("should change dir from jst to js by default", function(){
            var s = files._changeDir("jst/file.js");

            expect(s).to.eql("js/file.js");
        });

        it("should change from given dir to js", function(){
            var s = files._changeDir("src/file.js", {
                from: "src"
            });

            expect(s).to.eql("js/file.js");
        });

        it("should change from jst dir to given", function(){
            var s = files._changeDir("jst/file.js", {
                to: "dist"
            });

            expect(s).to.eql("dist/file.js");
        });

        it("should change from given dir to given", function(){
            var s = files._changeDir("src/file.js", {
                from: "src",
                to: "dist"
            });

            expect(s).to.eql("dist/file.js");
        });
         
        it("should handle hard path", function(){
            var s = files._changeDir("src/test/number/one/test.js", {
                from: "src/test/number",
                to: "dist/another"
            });

            expect(s).to.eql("dist/another/one/test.js");
        });

        it("should not touch single files", function(){
            var s = files._changeDir("file.js");

            expect(s).to.eql("file.js");
        });

        it("should not change anything except first dirs", function(){
            var s = files._changeDir("test/test/test/test.js", {
                from: "test",
                to: "hello"
            });

            expect(s).to.eql("hello/test/test/test.js");
        });
        
        it("should throw when bad from is given", function(){
            expect(function(){
                files._changeDir("src/test.js", {
                    from: "hello"
                });
            }).to.throwError();
        });
    });
});
