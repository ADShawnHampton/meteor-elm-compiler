var fs = Npm.require('fs');
var path = Npm.require('path');
var child_process = Npm.require('child_process');
var Fiber = Npm.require('fibers');
var NodeElmCompiler = Npm.require('node-elm-compiler');
var mkdirp = Npm.require('mkdirp');

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
        var outputDirectory = currentDir + "/" + elmOutputDir;
        var mainFilePath = currentDir + "/" + elmMainFile;
        var mainFileDir = path.dirname(mainFilePath);
        var outputFile = outputDirectory + "/" + path.basename(elmMainFile, ".elm") + "-elm.js"
        var elmMakeFilesDir = mainFileDir + "/" + ElmCompiler.ELM_DIR;
        
        var tmpThis = this;
        NodeElmCompiler.compileToString([mainFilePath], {cwd: elmMakeFilesDir}).then(function(data){
            var finalJsData = "(function (global, undefined) {\n" + data + "if (!(\"Elm\" in global)) {\n    global.Elm = Elm;\n}\n}) (this);";
            console.log("output directory : " + outputDirectory);
            mkdirp(outputDirectory);
            fs.writeFileSync(outputFile, finalJsData);
        }, function(err){
            console.log(err);
        });
    }

};