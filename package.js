Package.describe({
    name: "thatguyhampton:meteor-elm-compiler",
    version: "0.0.1",
    // Brief, one-line summary of the package.
    summary: "Automatically compiles elm code and redeploys meteor on save",
    // URL to the Git repository containing the source code for this package.
    git: "https://github.com/thatguyhampton/meteor-elm-compiler.git",
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: "README.md"
});

Npm.depends({
    "node-elm-compiler" : "3.0.0",
    "mkdirp" : "0.5.1"
});

Package.onUse(function(api) {
    api.versionsFrom("1.2.1");
    api.use([
        "ecmascript",
        "isobuild:compiler-plugin@1.0.0"
    ]);
    api.addFiles([
        "compiler/compiler.js"
    ], "server");
    api.export("ElmCompiler");
});

Package.onTest(function(api) {
    api.use([
        "tinytest",
        "ecmascript",
        "thatguyhampton:meteor-elm-compiler"
    ], ["client", "server"]);

    api.addFiles("meteor-elm-compiler-tests.js", ["client", "server"]);
});

Package.registerBuildPlugin({
    name: "meteor-elm-compiler",
    use: ["meteor"],
    sources: [
        "compiler/compiler.js",
        "meteor-elm-compiler.js"
    ],
    npmDependencies: {
        "node-elm-compiler" : "3.0.0",
        "mkdirp" : "0.5.1"
    }
});