// Write your tests here!

var testOutputDirectory = "testOutput/elm";
var testMainFile = "testapp/elm/elm-todomvc/Todo.elm";

var fs = Npm.require('fs');

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

Tinytest.addAsync("Test ElmCompiler.compileElm", function (test){
    test.isNotNull(ElmCompiler.compileElm);
    ElmCompiler.compileElm(testMainFile, testOutputDirectory);

});