// Write your package code here!

Plugin.registerCompiler({
    extensions : ["elm"],
    filenames : [ElmCompiler.ELM_COMPILER_SETTINGS_JSON_FILE]
}, function () {
    return ElmCompiler;
});