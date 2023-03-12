
/**
 * 1) put this script in an empty folder (because this script will delete ./output)
 * 2) download typescript from https://github.com/JsMacros/JsMacros/releases
 * 3) extract both d.ts files to the same folder as this script
 * 4) run `node JsmTypesConverter.js` in cmd (in same folder, obviously)
 * 5) close vscode
 * 6) move the node_modules folder in ./output/ to the same folder as Macros folder
 * 7) open vscode
 * 8) 👍
 * 
 * tested versions: 1.19+1.8.3, 1.20+1.8.4beta
 */

const options = {
  // both
  removeExtraSpace: true,
  spaceAfterColon: true,
  dictifyJavaTypes: true, // remove the 500+ overloads (it's 957 in 1.8.4... jeez)
  shortifyTypes: true, // will shortify Class, Array, Collection, List, Map, _javatypes.xyz.*
  // graal
  fixGraalTypes: true, // Java. to _javatype. and class fix
  fixJavaFromTypes: true, // fix type template
  // jsmacros
  fixEventTypes: true // let vscode actually suggest about events
}

const fs = require('node:fs/promises')
main()

async function main() {
  const dir = await fs.readdir('./')
  const graalFile = dir.find(f => /^Graal\.d\.ts$/.test(f))
  const jsmFile = dir.find(f => /^JsMacros-[\d\.]+\.d\.ts$/.test(f))
  if (!graalFile) throw "can't find graal.d.ts file!"
  if (!jsmFile) throw "can't find jsmacros.d.ts file!"
  let graal = await fs.readFile(graalFile, 'utf8')
  let jsm = await fs.readFile(jsmFile, 'utf8')
  const version = jsmFile.match(/^JsMacros-([\d\.]+)\.d\.ts$/)[1]
  console.log('jsmacros version: ' + version)
  const rmd = new Promise(async res => {
    try {
      await fs.rm('./output', {recursive: true, force: true})
    }catch (e) {
      console.log('error while removing output: ' + e.message)
    }
    res()
  })
  if (options.removeExtraSpace) {
    console.log('processing removeExtraSpace: graal')
    graal = graal.replace(/ +$/gm, '')
    console.log('processing removeExtraSpace: jsm')
    jsm   =   jsm.replace(/ +$/gm, '')
  }
  if (options.spaceAfterColon) {
    console.log('processing spaceAfterColon: graal')
    graal = graal.replace(/:(?=\S)/g, ': ')
    console.log('processing spaceAfterColon: jsm')
    jsm   =   jsm.replace(/:(?=\S)/g, ': ')
  }
  if (options.dictifyJavaTypes) {
    const regex = /(?<=declare namespace Java {\n)(?:    export function type\(className: "[\w\.$]+"\): ?.+\n)+/
    const singleRegex = /export function type\(className: ("[\w\.$]+")\): ?(.+)/gm
    for (let i = 1; i >= 0; i--) {
      console.log(`processing dictifyJavaTypes: ${i ? 'graal' : 'jsm'}`)
      const to =
`    export function type<C extends keyof JavaTypeDict>(className: C): JavaTypeDict[C]
}

interface JavaTypeDict {
${(i ? graal : jsm).match(regex)?.[0].replace(singleRegex, '$1: $2')}`
      if (i) graal = graal.replace(regex, to)
      else   jsm   =   jsm.replace(regex, to)
    }
  }

  if (options.fixGraalTypes) {
    console.log('processing fixGraalTypes: graal')
    graal = graal.replace(/Java\./g, '_javatypes.')
      .replace(/^            interface Class<T> extends Object {}$/m,
`            interface Class<T> extends Object {
                new(): T
            }`)
  }
  if (options.fixJavaFromTypes) {
    console.log('processing fixJavaFromTypes: graal')
    graal = graal.replace(
      /(?:export function from<T>[^\n]+: T\[\];?\n    )+/,
   `export function from<T>(javaData: _javatypes.java.lang.Array<T>): T[];
    export function from<T>(javaData: _javatypes.java.util.List<T>): T[];
    export function from<T>(javaData: _javatypes.java.util.Collection<T>): T[];
    `
    )
  }

  if (options.fixEventTypes) {
    console.log('processing fixEventTypes: jsm')
    let match = jsm.match(/declare namespace Events \{\n(?:(?:[^}].+)?\n)+\}/)
    if (!match) throw 'Events not found'
    jsm = '\n' + match[0]
      .replace(/^declare namespace Events {/, 'interface JsmEvents {')
      .replace(/^    interface ([A-Za-z]+) extends BaseEvent \{$/gm, '    $1: {')
      .replace(/\n    export(?:[^}]+\n)    \}/g, '') + '\n\n\n' + jsm.trimStart()
    const replaceTable = {
      'function on(event: string, callback: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<Events.BaseEvent, _javatypes.xyz.wagyourtail.jsmacros.core.language.EventContainer<any>, any, any>): _javatypes.xyz.wagyourtail.jsmacros.core.event.IEventListener;':
        'function on<E extends keyof JsmEvents>(event: E, callback: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<JsmEvents[E], _javatypes.xyz.wagyourtail.jsmacros.core.language.EventContainer<any>, any, any>): _javatypes.xyz.wagyourtail.jsmacros.core.event.IEventListener;',
      'function once(event: string, callback: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<Events.BaseEvent, _javatypes.xyz.wagyourtail.jsmacros.core.language.EventContainer<any>, any, any>): _javatypes.xyz.wagyourtail.jsmacros.core.event.IEventListener;':
        'function once<E extends keyof JsmEvents>(event: E, callback: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<JsmEvents[E], _javatypes.xyz.wagyourtail.jsmacros.core.language.EventContainer<any>, any, any>): _javatypes.xyz.wagyourtail.jsmacros.core.event.IEventListener;',
      'function off(event: string, listener: _javatypes.xyz.wagyourtail.jsmacros.core.event.IEventListener): boolean;':
        'function off<E extends keyof JsmEvents>(event: E, listener: _javatypes.xyz.wagyourtail.jsmacros.core.event.IEventListener): boolean;',
      'function waitForEvent(event: string): _javatypes.xyz.wagyourtail.jsmacros.core.library.impl.FJsMacros$EventAndContext;':
        'function waitForEvent<E extends keyof JsmEvents>(event: E): _javatypes.xyz.wagyourtail.jsmacros.core.library.impl.FJsMacros$EventAndContext<JsmEvents[E]>;',
      'function waitForEvent(event: string, filter: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<Events.BaseEvent, any, boolean, any>): _javatypes.xyz.wagyourtail.jsmacros.core.library.impl.FJsMacros$EventAndContext;':
        'function waitForEvent<E extends keyof JsmEvents>(event: E, filter: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<JsmEvents[E], any, boolean, any>): _javatypes.xyz.wagyourtail.jsmacros.core.library.impl.FJsMacros$EventAndContext<JsmEvents[E]>;',
      'function waitForEvent(event: string, filter: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<Events.BaseEvent, any, boolean, any>, runBeforeWaiting: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<any, any, any, any>): _javatypes.xyz.wagyourtail.jsmacros.core.library.impl.FJsMacros$EventAndContext;':
        'function waitForEvent<E extends keyof JsmEvents>(event: E, filter: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<JsmEvents[E], any, boolean, any>, runBeforeWaiting: _javatypes.xyz.wagyourtail.jsmacros.core.MethodWrapper<any, any, any, any>): _javatypes.xyz.wagyourtail.jsmacros.core.library.impl.FJsMacros$EventAndContext<JsmEvents[E]>;',
      'function listeners(event: string): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.core.event.IEventListener>;':
        'function listeners<E extends keyof JsmEvents>(event: E): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.core.event.IEventListener>;',
      'interface FJsMacros$EventAndContext extends any {\n                            readonly event: Events.BaseEvent;':
        'interface FJsMacros$EventAndContext<E> extends any {\n                            readonly event: E;'
    }
    for (const from in replaceTable) {
      if (!jsm.includes(from)) {
        console.log(`can't find ${from}\nmaybe something changed?`)
        continue
      }
      jsm = jsm.replace(from, replaceTable[from])
    }
  }

  if (options.shortifyTypes) {
    const the4 = {
      JavaClass:      /_javatypes\.java\.lang\.Class(?=<)/g,
      JavaArray:      /_javatypes\.java\.lang\.Array(?=<)/g,
      JavaCollection: /_javatypes\.java\.util\.Collection(?=<)/g,
      JavaList:       /_javatypes\.java\.util\.List(?=<)/g,
      JavaMap:        /_javatypes\.java\.util\.Map(?=<)/g
    }
    console.log('processing shortifyTypes: graal')
    for (const type in the4) graal = graal.replace(the4[type], type)
    graal = `
type JavaClass<T>      = _javatypes.java.lang.Class<T>
type JavaArray<T>      = _javatypes.java.lang.Array<T>
type JavaCollection<T> = _javatypes.java.util.Collection<T>
type JavaList<T>       = _javatypes.java.util.List<T>
type JavaMap<K, V>     = _javatypes.java.util.Map<K, V>

` + graal.trimStart()

    console.log('processing shortifyTypes: jsm')
    for (const type in the4) jsm = jsm.replace(the4[type], type)
    const regex = /_javatypes\.xyz(?:\.[\w$]+)+/
    const nameRegex = /[^\.]+$/
    const overrides = {
      'PositionCommon$Pos2D': 'Pos2D',
      'PositionCommon$Pos3D': 'Pos3D',
      'PositionCommon$Vec2D': 'Vec2D',
      'PositionCommon$Vec3D': 'Vec3D'
    }
    const ignores = [
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon.Pos2D',
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon.Pos3D',
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon.Vec2D',
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon.Vec3D',
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon.Image',
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon.Item',
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon.Rect',
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon.RenderElement',
      '_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon.Text'
    ]
    const T = [
      '',
      '<T>',
      '<T, U>',
      '<T, U, R>',
      '<T, U, R, C>'
    ]
    const anyT = [
      '',
      '<any>',
      '<any, any>',
      '<any, any, any>',
      '<any, any, any, any>'
    ]
    /** @type {{ [type: string]: { name: string, Targs: number } }} */
    const types = {}
    let jsmbuf = ''
    while (true) {
      jsmbuf += jsm[0] // prevent infinite loop
      jsm = jsm.slice(1)
      const match = jsm.match(regex)
      if (!match) break
      jsmbuf += jsm.slice(0, match.index)
      jsm = jsm.slice(match.index)
      if (ignores.includes(match[0])) continue
      let Targs = 0
      if (jsm[match[0].length] === '<') {
        Targs = 1
        let incmt = false
        for (let layer = 1, i = match[0].length + 1; layer > 0; i++) {
          if (incmt) {
            if (jsm.slice(i, i + 2) === '*/') incmt = false
          }
          else switch (jsm[i]) {
            case undefined:
              throw 'not closed <>'
            case ',':
              if (layer === 1) Targs++
              break
            case '<':
            case '(':
            case '[':
              layer++
              break
            case '>':
            case ')':
            case ']':
              layer--
              break
            case '/':
              if (jsm[i + 1] === '*') incmt = true
              break
            default:
              break
          }
        }
      }
      if (Targs > 4) {
        console.log(`Targs > 4 (${match[0]}) (${Targs})`)
        continue
      }
      let name = match[0].match(nameRegex)?.[0]
      if (!name) {
        console.log(`can't get name of ${match[0]}`)
        continue
      }
      if (name === 'static') continue
      if (name in overrides) name = overrides[name]
      const forRegExp = match[0]
        .replace(/\./g, '\\.')
        .replace(/\$/g, '\\$')
      jsm = jsm
        .replace(RegExp(forRegExp + '(?![\\.A-Za-z$>])', 'g'), name)
        .replace(RegExp(forRegExp + '(?=>)', 'g'), name + anyT[Targs])
      types[match[0]] = { name, Targs }
    }
    jsm = jsmbuf + jsm
    const maxLength = Object.values(types)
      .reduce((p, v) => Math.max(p, (v.name + T[v.Targs]).length), 0)
    jsm = `
type _ = { [none: symbol]: undefined } // to trick vscode to rename types

${Object.keys(types).sort().map(t => 
  `type ${(types[t].name + T[types[t].Targs]).padEnd(maxLength)} = ${
    types[t].Targs ? '  ' : '_&'}${t + T[types[t].Targs]}`
).join('\n')}

` + jsm.trimStart()
  }
  console.log('exporting...')
  await rmd
  await fs.mkdir('./output/node_modules/@types/graal',    {recursive: true})
  await fs.mkdir('./output/node_modules/@types/jsmacros', {recursive: true})
  await Promise.all([
    fs.writeFile(`./output/node_modules/@types/graal/${graalFile}`, graal),
    fs.writeFile(`./output/node_modules/@types/jsmacros/${jsmFile}`, jsm),
    fs.writeFile(`./output/node_modules/@types/graal/package.json`, JSON.stringify({
      name: "@types/graal",
      version: "1.0.0",
      description: "TypeScript definitions for Graal",
      homepage: "https://github.com/JsMacros/JsMacros/releases",
      license: "MIT",
      types: "Graal.d.ts"
    }, undefined, '  ')),
    fs.writeFile(`./output/node_modules/@types/jsmacros/package.json`, JSON.stringify({
      name: "@types/jsmacros",
      version,
      description: "TypeScript definitions for JsMacros",
      homepage: "https://github.com/JsMacros/JsMacros/releases",
      license: "MIT",
      types: jsmFile
    }, undefined, '  '))
  ])
  console.log('done')
}
