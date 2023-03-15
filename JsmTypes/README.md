# JsMacros Types Converter
  A converter that fix and add some types to jsmacros typescript definitions. based on vscode, which is my ide

## Steps
  0) If `options.extraTypes` is true, run the JsmExtraTypeGenerator.js as jsmacros script and make sure the exported JsmExtra.d.ts is at the same folder as JsmTypesConverter.js
  1) Download typescript from [JsMacros Releases](https://github.com/JsMacros/JsMacros/releases)
  2) Extract both d.ts files to the same folder as JsmTypesConverter.js
  3) Run `node JsmTypesConverter.js` in cmd (in same folder, obviously)
  * You need to have [NodeJs](https://nodejs.org/) installed
  * This script will delete ./output folder, be careful if you have some files in it
  4) Close vscode
  5) Move the node_modules folder in ./output/ to the same folder as Macros folder
  6) Open vscode
  7) 👍

## Note
* This script is made on jsm1.8.3 and mc1.19.2. convert on other version may need some modification
* If you're too lazy to run the script, there's a premade zip file. extract it and continue step 4
* The premade file may have some extra modded type since I generated it with mods on
