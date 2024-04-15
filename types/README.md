[![Web Playground](https://img.shields.io/static/v1?logo=visualstudiocode&label=&message=Open+Playground+in+vscode.dev&labelColor=2c2c32&color=007acc&logoColor=007acc "vscode.dev might ask you to authorize github, for unlocking rate limit.")](https://vscode.dev/github/aMelonRind/JsMacros-scripts/blob/main/types/playground.js)

If you want to write ts, you probably shouldn't follow the instructions here. Instead, go to [Wagyourtail's Discord Server](https://github.com/JsMacros/JsMacros?tab=readme-ov-file#jsmacros) then search `autocomplete` in #bot-commands.

How to install as a fake node_module package (for vscode to work, i'm not sure about others):
1. Download this repo, extract it somewhere (in `Macros` folder if you can't decide)
2. Open environment.zip, extract the node_modules folder to `jsMacros` folder, which is the parent of `Macros` folder
3. Open `node_modules/@types/jsm/index.d.ts`, redirect the path to the index.d.ts in this folder, where you extracted it in step 1
4. Reload vscode, then open `Macros` folder in vscode if you didn't (simply drag the folder into vscode explorer)
5. Should be good to go, vscode should be able to load the environment types

tip: put `//@ts-check` at the first line to enable type checking in js.

i didn't use jsconfig is because i don't want a file that is not code nor data to exist in the root of `Macros` folder, and i don't want to open `jsMacros` in vscode because it doesn't look good imo.
