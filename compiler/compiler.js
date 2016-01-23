var fs = Npm.require('fs');
var path = Npm.require('path');
var child_process = Npm.require('child_process');
var Fiber = Npm.require('fibers');
var NodeElmCompiler = Npm.require('node-elm-compiler');
var mkdirp = Npm.require('mkdirp');
Npm.require('es5-shim');
Npm.require('es6-shim');

ElmCompiler = {

    // Necessary setup file for this package to run correctly. This needs to be in projects main directory
    ELM_COMPILER_SETTINGS_JSON_FILE : "meteor-elm-compiler-settings.json",
    ELM_DIR : ".elm",

    // Opens the compiler-elm-settings.json file to get locations of necessary files
    // Then runs compile process
    processFilesForTarget : function (files) {
        console.log("Rebuilding Elm");
        var currentDir = process.env.PWD;
        try {
            var elmSettingsJSON = fs.readFileSync(currentDir + "/" + ElmCompiler.ELM_COMPILER_SETTINGS_JSON_FILE, 'utf8');
        } catch (e) {
            if (e.code != "ENOENT") throw e;
            throw new Error("meteor-elm-compiler was unable to find necessary configuration file " + ElmCompiler.ELM_COMPILER_SETTINGS_JSON_FILE);
        }
        var elmSettings = JSON.parse(elmSettingsJSON);

        var elmMainFiles = elmSettings.elmMainFiles;
        var elmOutputDir = elmSettings.outputDirectory;
        if (elmOutputDir != null) {
            for (var i = 0; i < elmMainFiles.length; i++) {
                var elmMainFile = elmMainFiles[i];
                this.compileElm(elmMainFile, elmOutputDir);
            }
        } else {
            throw new Error("meteor-elm-compiler was not able to find necessary property \"outputDirectory\" in " + ElmCompiler.ELM_COMPILER_SETTINGS_JSON_FILE);
        }
        console.log("Completed Elm Compilation\n");
    },

    // elmMain : main .elm file for project
    // elmOutput : ouput location for compiled javascript
    compileElm : function (elmMainFile, elmOutputDir) {
        var currentDir = process.env.PWD;
        var outputDirectory = ElmCompiler.outputDirectory(elmOutputDir);
        var mainFilePath = currentDir + "/" + elmMainFile;
        var mainFileDir = path.dirname(mainFilePath);
        var outputFile = ElmCompiler.outputFileNameForElm(elmMainFile, elmOutputDir);
        var elmMakeFilesDir = mainFileDir + "/" + ElmCompiler.ELM_DIR;
        
        var tmpThis = this;
        return NodeElmCompiler.compileToString([mainFilePath], {cwd: elmMakeFilesDir}).then(Meteor.bindEnvironment(function(data){
            var finalJsData = "(function (global, undefined) {\n" + data + "if (!(\"Elm\" in global)) {\n    global.Elm = Elm;\n}\n}) (this);";
            mkdirp.sync(outputDirectory);
            fs.writeFileSync(outputFile, finalJsData);
        }), Meteor.bindEnvironment(function(err){
            console.log(err);
        }));
    },

    // generate output directory path
    outputDirectory : function(elmOutputDir) {
        return process.env.PWD + "/" + elmOutputDir;
    },

    // generate output file path
    outputFileNameForElm : function (elmMainFile, elmOutputDir) {
        return ElmCompiler.outputDirectory(elmOutputDir) + "/" + path.basename(elmMainFile, ".elm") + "-elm.js";
    } 

};