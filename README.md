#Meteor-Elm-Compiler

This is a meteor package created for compiling elm code to javascript on .elm file changes.

##Setup

<!-- Add the package to your meteor project like this `meteor add thatguyhampton:compiler-elm` -->

Using this package correctly requires you to add a file named `meteor-elm-compiler-settings.json` to the top level directory of your meteor project. To this file you must add two properties : 

```
{
    "outputDirectory" : "client/elm",
    "elmMainFiles" : [
                        "{path to first main elm file}", 
                        "{path to second main elm file}"
                     ]
}
```