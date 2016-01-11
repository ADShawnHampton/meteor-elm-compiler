Package.describe({
  name: 'thatguyhampton:meteor-elm-compiler',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Automatically compiles elm code and redeploys meteor on save',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/thatguyhampton/meteor-elm-compiler.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "node-elm-compiler" : "3.0.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use('isobuild:compiler-plugin@1.0.0');
  api.export('ElmCompiler');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('thatguyhampton:meteor-elm-compiler');
  api.use('tinytest');
  api.addFiles('meteor-elm-compiler-tests.js');
});

Package.registerBuildPlugin({
  name: "meteor-elm-compiler",
  use: ['meteor'],
  sources: [
    'meteor-elm-compiler.js'
  ],
  npmDependencies: {
    "node-elm-compiler" : "3.0.0"
  }
});