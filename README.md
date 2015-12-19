#Compiler-Elm

This is a meteor package created for compiling elm code to javascript on .elm file changes.

##Setup

Using this package correctly requires you to add a file named "compiler-elm-settings.json" to the top level directory of your meteor project. To this file you must add two properties : 

```
{
    "outputDirectory" : "client/elm",
    "elmMainFiles" : ["[path to first main elm file]", "[path to second main elm file]"]
}
```