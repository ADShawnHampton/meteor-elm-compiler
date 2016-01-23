// Write your tests here!

var testOutputDirectory = "testOutput/elm";
var testMainFile = "testapp/elm/elm-todomvc/Todo.elm";

var fs = Npm.require('fs');
var Fiber = Npm.require('fibers');
var rimraf = Npm.require('rimraf');

Tinytest.add("Test ElmCompiler exported", function(test) {
    test.isNotNull(ElmCompiler);
});

Tinytest.add("Test ElmCompiler.ELM_COMPILER_SETTINGS_JSON_FILE exists", function(test){
    test.isNotNull(ElmCompiler.ELM_COMPILER_SETTINGS_JSON_FILE);
});

Tinytest.add("Test ElmCompiler.ELM_DIR exists", function(test){
    test.isNotNull(ElmCompiler.ELM_DIR);
});

Tinytest.add("Test ElmCompiler.processFilesForTarget", function (test){
    test.isNotNull(ElmCompiler.processFilesForTarget);
});

Tinytest.addAsync("Test ElmCompiler.compileElm", function (test, next){
    var finalTestOutputDirectory = ElmCompiler.outputDirectory(testOutputDirectory);
    var finalTestOutputFile = ElmCompiler.outputFileNameForElm(testMainFile, testOutputDirectory);
    test.isNotNull(ElmCompiler.compileElm);
    ElmCompiler.compileElm(testMainFile, testOutputDirectory).then(Meteor.bindEnvironment(function() {
        fs.stat(finalTestOutputDirectory, Meteor.bindEnvironment(function(err, stats) {
            if (err) {
                test.fail("Directory(" + finalTestOutputDirectory + ") doesn't exist but should exist");
            }
            else if (!stats.isDirectory()) {
                test.fail(finalTestOutputDirectory + " is not a directory");
            }
        
            fs.stat(finalTestOutputFile, Meteor.bindEnvironment(function(err, stats) {
                if (err) {
                    test.fail("Output file (" + finalTestOutputFile + ") doesn't exist but should exist");
                }
                else if (!stats.isFile()) {
                    test.fail(finalTestOutputFile + " is not a file");
                }
                
                rimraf(finalTestOutputDirectory, Meteor.bindEnvironment(function(err) {
                    if (err) {
                        test.fail("Failed to remove directory " + finalTestOutputDirectory);
                    }
                    next();
                }));
            }));
        }));
    }), Meteor.bindEnvironment(function(err) {
        test.fail("ElmCompiler.compileElm Failed");
        next();
    }));
});

Tinytest.add("Test ElmCompiler.outputDirectory", function (test){
    test.isNotNull(ElmCompiler.outputDirectory);
    var expectedPath = process.env.PWD + "/" + testOutputDirectory;
    var retPath = ElmCompiler.outputDirectory(testOutputDirectory);
    test.equal(retPath, expectedPath, "Returned path did not match expected path");
});

Tinytest.add("Test ElmCompiler.outputFileNameForElm", function(test) {
    test.isNotNull(ElmCompiler.outputFileNameForElm);
    var expectedPath = ElmCompiler.outputDirectory(testOutputDirectory) + "/Todo-elm.js";
    var retPath = ElmCompiler.outputFileNameForElm(testMainFile, testOutputDirectory);
    test.equal(retPath, expectedPath, "Returned path did not match expected path");
});