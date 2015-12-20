// Write your package code here!

var fs = Npm.require('fs');
var path = Npm.require('path');
var child_process = Npm.require('child_process');
var Fiber = Npm.require('fibers');

// Necessary setup file for this package to run correctly. This needs to be in projects main directory
var ELM_COMPILER_SETTINGS_JSON_FILE = "meteor-elm-compiler-settings.json";

// Tmp javascript file that gets created from the elm compile process and copied to "outputLocation" specified in compiler-elm-settings.json
var COMPILER_ELM_TMP_COMPILE_FILENAME = ".meteor-elm-compiler-temp.txt";
var ELM_DIR = ".elm";

ElmCompiler = {

    // Opens the compiler-elm-settings.json file to get locations of necessary files
    // Then runs compile process
    processFilesForTarget : function (files) {
        console.log("Rebuilding Elm");
        var currentDir = process.env.PWD;
        var elmSettings = JSON.parse(fs.readFileSync(currentDir + "/" + ELM_COMPILER_SETTINGS_JSON_FILE, 'utf8'));

        var elmMainFiles = elmSettings.elmMainFiles;
        var elmOutputDir = elmSettings.outputDirectory;
        for (var i = 0; i < elmMainFiles.length; i++) {
            var elmMainFile = elmMainFiles[i];
            if (elmMainFile != null) {
                this.compileElm(elmMainFile, elmOutputDir)
            }
        }
    },

    // elmMain : main .elm file for project
    // elmOutput : ouput location for compiled javascript
    compileElm : function (elmMainFile, elmOutputDir) {
        var currentDir = process.env.PWD;
        var outputDirectory = currentDir + "/" + elmOutputDir;
        var mainFilePath = currentDir + "/" + elmMainFile;
        var mainFileDir = path.dirname(mainFilePath);
        var outputFile = outputDirectory + "/" + path.basename(elmMainFile, ".elm") + "-elm.js"
        var elmMakeFilesDir = mainFileDir + "/" + ELM_DIR;
        var tmpElmFilePath = elmMakeFilesDir + "/" + COMPILER_ELM_TMP_COMPILE_FILENAME;
        var args = '"' + ["elm-make", mainFilePath, "--output", tmpElmFilePath].join('" "') + '"';
        var fiber = Fiber.current;
        var execErr, execStdout, execStderr;
        child_process.exec(args, {cwd : elmMakeFilesDir}, function(err, stdout, stderr) {
            execErr = err;
            execStdout = stdout;
            execStderr = stderr;
            fiber.run();
        });
        Fiber.yield();

        if (execStderr) {
            console.log(execStderr);
            return;
        }
        if (execStdout) {
            console.log(execStdout);
        }

        var jsData = fs.readFileSync(tmpElmFilePath, 'utf8');
        var finalJsData = "(function (global, undefined) {\n" + jsData + "if (!(\"Elm\" in global)) {\n    global.Elm = Elm;\n}\n}) (this);";
        this.makeDirIfNotExists(outputDirectory);
        // write final output javascript file
        fs.writeFileSync(outputFile, finalJsData);
        // Clean up tmp js file
        this.deleteFileIfExists(tmpElmFilePath);
        console.log("Completed Elm Compilation\n");
    },

    makeDirIfNotExists : function (dirPath) {
        try {
            fs.mkdirSync(dirPath);
        } catch (e) {
            if (e.code != "EEXIST") throw e;
        }
    },

    deleteFileIfExists : function (filePath) {
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            if (e.code != "ENOENT") throw e;
        }
    }
};

Plugin.registerCompiler({
    extensions : ["elm"],
    filenames : [ELM_COMPILER_SETTINGS_JSON_FILE]
}, function () {
    return ElmCompiler;
});