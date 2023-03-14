
const options = {
  // both
  dictifyJavaTypes: true, // remove the 500+ overloads (it's 957 in 1.8.4... jeez)
  shortifyTypes: true, // will shortify Class, Array, Collection, List, HashMap, Map, Set, _javatypes.xyz.*
  // graal
  fixGraalTypes: true, // Java. to _javatype.
  fixJavaFromTypes: true, // fix type template
  // jsmacros
  fixJsmTypes: true, // fix every type that has $ in it
  extraTypes: true, // suggest about ItemId, BlockId, EntityId and stuff. need runtime generation.
  fixEventTypes: true // let vscode actually suggest about events
}

const jsmFileReg = /^JsMacros-([\d\.]+)\.d\.ts$/

const fs = require('node:fs/promises')
main()

async function main() {
  const dir = await fs.readdir('./')
  const jsmFile = dir.filter(f => jsmFileReg.test(f)).sort().at(-1)
  if (!dir.includes('Graal.d.ts')) throw "can't find Graal.d.ts file!"
  if (!jsmFile) throw "can't find JsMacros.d.ts file!"
  if (options.extraTypes && !dir.includes('JsmExtra.d.ts')) throw "can't find JsmExtra.d.ts file!"
  let graal = await fs.readFile('Graal.d.ts', 'utf8')
  let jsm = await fs.readFile(jsmFile, 'utf8')
  const version = jsmFile.match(jsmFileReg)[1]
  console.log('jsmacros version: ' + version)
  const rmd = dir.includes('output') ? new Promise(async res => {
    try {
      await fs.rm('./output', {recursive: true, force: true})
    }catch (e) {
      console.log('error while removing output: ' + e.message)
    }
    res()
  }) : null
  console.log('processing...')
  console.log('spaces: graal')
  graal = graal.replace(/ +$/gm, '').replace(/:(?=\S)/g, ': ')
  console.log('spaces: jsm')
  jsm = jsm.replace(/ +$/gm, '').replace(/:(?=\S)/g, ': ')
  if (options.dictifyJavaTypes) {
    const regex = /(?<=declare namespace Java {\n)(?:    export function type\(className: "[\w\.$]+"\): .+\n)+/
    const singleRegex = /export function type\(className: ("[\w\.$]+")\): (.+)/gm
    for (let i = 1; i >= 0; i--) {
      console.log(`dictifyJavaTypes: ${i ? 'graal' : 'jsm'}`)
      const to =
`    export function type<C extends keyof JavaTypeDict>(className: C): JavaTypeDict[C]
}

interface JavaTypeDict {
${(i ? graal : jsm).match(regex)?.[0].replace(singleRegex, '$1: $2')}`
      if (i) graal = graal.replace(regex, to)
      else   jsm   =   jsm.replace(regex, to)
    }
    const replaceTable = {
      'function getClass<T>(name: string): _javatypes.java.lang.Class<T> & { new(...values): T }':
        'function getClass<T extends keyof JavaTypeDict>(name: T): JavaTypeDict[T]',
      'function getClass<T>(name: string, name2: string): _javatypes.java.lang.Class<T> & { new(...values): T }':
        'function getClass<T extends keyof JavaTypeDict>(name: T, name2: string): JavaTypeDict[T]'
    }
    for (const from in replaceTable) {
      if (!jsm.includes(from)) {
        console.log(`can't find ${from}\nmaybe something changed?`)
        continue
      }
      jsm = jsm.replace(from, replaceTable[from])
    }
  }

  if (options.fixGraalTypes) {
    console.log('fixGraalTypes: graal')
    graal = graal.replace(/Java\./g, '_javatypes.')
  }
  if (options.fixJavaFromTypes) {
    console.log('fixJavaFromTypes: graal')
    graal = graal.replace(
      /(?:export function from<T>[^\n]+: T\[\];?\n    )+/,
   `export function from<T>(javaData: _javatypes.java.lang.Array<T>): T[];
    export function from<T>(javaData: _javatypes.java.util.List<T>): T[];
    export function from<T>(javaData: _javatypes.java.util.Collection<T>): T[];
    `
    )
  }

  if (options.extraTypes) {
    console.log('extraTypes: jsm')
    const extra = getExtraTypesReplaces()
    console.log(' events')
    let temp = jsm.match(/declare namespace Events \{\n(?:(?:[^}].+)?\n)+\}/)?.[0]
    if (!temp) throw 'Events not found'
    const slice = str => str.match(/^([\w$]+)\.(.+)$/).slice(1)
    for (let i = 0; i < extra.event.length; i += 2) {
      const [ event, field ] = slice(extra.event[i])
      const reg = RegExp(`(?<=\n    interface ${escape(event)} extends BaseEvent \{\n+(?:        .*\n+)*        (?:readonly )?)${escape(field)}`)
      if (!reg.test(temp)) {
        console.log(`index ${i} not found`)
        continue
      }
      temp = temp.replace(reg, extra.event[i + 1])
    }
    jsm = jsm.replace(/declare namespace Events \{\n(?:(?:[^}].+)?\n)+\}/, temp)
    console.log(' libraries')
    for (let i = 0; i < extra.library.length; i += 2) {
      const [ lib, method ] = slice(extra.library[i])
      const reg = RegExp(`(?<=\nnamespace ${escape(lib)} \{\n+(?:    .*\n+)*    function )${escape(method)}`)
      if (!reg.test(jsm)) {
        console.log(`index ${i} not found`)
        continue
      }
      jsm = jsm.replace(reg, extra.library[i + 1])
    }
    let api = jsm.match(/ {16}namespace api \{(?:.*\n)*? {16}\}/)?.[0].replace(/^ {16}/gm, '')
    if (!api) throw 'api not found'
    console.log(' helpers')
    for (let i = 0; i < extra.helper.length; i += 2) {
      const [ helper, method ] = slice(extra.helper[i])
      const reg = RegExp(`(?<=\n {8}interface ${escape(helper)}.+\{\n+(?: {12}.*\n+)* {12})${escape(method)}`)
      if (!reg.test(api)) {
        console.log(`index ${i} not found`)
        continue
      }
      api = api.replace(reg, extra.helper[i + 1])
    }
    console.log(' classes')
    for (let i = 0; i < extra.class.length; i += 2) {
      const [ clazz, method ] = slice(extra.class[i])
      const reg = RegExp(`(?<=\n {8}interface ${escape(clazz)}.+\{\n+(?: {12}.*\n+)* {12})${escape(method)}`)
      if (!reg.test(api)) {
        console.log(`index ${i} not found`)
        continue
      }
      api = api.replace(reg, extra.class[i + 1])
    }
    console.log(' worldscanner')
    for (let i = 0; i < extra.worldscanner.length; i += 2) {
      const [ clazz, method ] = slice(extra.worldscanner[i])
      const reg = RegExp(`(?<=\n {12}interface ${escape(clazz)}.+\{\n+(?: {16}.*\n+)* {16})${escape(method)}`)
      if (!reg.test(api)) {
        console.log(`index ${i} not found`)
        continue
      }
      api = api.replace(reg, extra.worldscanner[i + 1])
    }
    console.log(' sharedinterfaces')
    for (let i = 0; i < extra.sharedinterfaces.length; i += 2) {
      const [ interface, method ] = slice(extra.sharedinterfaces[i])
      const reg = RegExp(`(?<=\n {8}interface ${escape(interface)}.+\{\n+(?: {12}.*\n+)* {12})${escape(method)}`)
      if (!reg.test(api)) {
        console.log(`index ${i} not found`)
        continue
      }
      api = api.replace(reg, extra.sharedinterfaces[i + 1])
    }
    console.log(' sharedclasses')
    for (let i = 0; i < extra.sharedclasses.length; i += 2) {
      const [ clazz, method ] = slice(extra.sharedclasses[i])
      const reg = RegExp(`(?<=\n {8}interface ${escape(clazz)}.+\{\n+(?: {12}.*\n+)* {12})${escape(method)}`)
      if (!reg.test(api)) {
        console.log(`index ${i} not found`)
        continue
      }
      api = api.replace(reg, extra.sharedclasses[i + 1])
    }
    jsm = jsm.replace(/ {16}namespace api \{(?:.*\n)*? {16}\}/, api.replace(/^/gm, ' '.repeat(16)))
  }
  if (options.fixJsmTypes || options.shortifyTypes) {
    console.log('fixJsmTypes: jsm' + (options.fixJsmTypes ? '' : ', overrided by shortifyTypes'))
    jsm.match(/(?<=\.)[\w$]+\$\w/g)
      .sort()
      .filter((v, i, a) => v !== a[i - 1])
      .forEach(t => jsm = jsm.replace(RegExp(t.replace(/\$/g, '[\\.$]'), 'g'), t))
  }
  if (options.fixEventTypes) {
    console.log('fixEventTypes: jsm')
    const match = jsm.match(/declare namespace Events \{\n(?:(?:[^}].+)?\n)+\}/)?.[0]
    if (!match) throw 'Events not found'
    jsm = '\n' + match
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
    const the6 = {
      JavaClass:      /_javatypes\.java\.lang\.Class(?=<)/g,
      JavaArray:      /_javatypes\.java\.lang\.Array(?=<)/g,
      JavaCollection: /_javatypes\.java\.util\.Collection(?=<)/g,
      JavaList:       /_javatypes\.java\.util\.List(?=<)/g,
      JavaSet:        /_javatypes\.java\.util\.Set(?=<)/g,
      JavaMap:        /_javatypes\.java\.util\.Map(?=<)/g,
      JavaHashMap:    /_javatypes\.java\.util\.HashMap(?=<)/g
    }
    console.log('shortifyTypes: graal')
    for (const type in the6) graal = graal.replace(the6[type], type)
    graal = `
type JavaClass<T>      = _javatypes.java.lang.Class<T>
type JavaArray<T>      = _javatypes.java.lang.Array<T>
type JavaCollection<T> = _javatypes.java.util.Collection<T>
type JavaList<T>       = _javatypes.java.util.List<T>
type JavaSet<T>        = _javatypes.java.util.Set<T>
type JavaMap<K, V>     = _javatypes.java.util.Map<K, V>
type JavaHashMap<K, V> = _javatypes.java.util.HashMap<K, V>

` + graal.trimStart()

    console.log('shortifyTypes: jsm')
    for (const type in the6) jsm = jsm.replace(the6[type], type)
    const regex = /_javatypes\.xyz(?:\.[\w$]+)+/
    const nameRegex = /[^\.]+$/
    const overrides = {
      'PositionCommon$Pos2D': 'Pos2D',
      'PositionCommon$Pos3D': 'Pos3D',
      'PositionCommon$Vec2D': 'Vec2D',
      'PositionCommon$Vec3D': 'Vec3D'
    }
    const T = [
      '',
      '<T>',
      '<T, U>',
      '<T, U, R>',
      '<T, U, R, C>'
    ]
    const anyT = T.map(s => s.replace(/[A-Z]/g, 'any'))
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
      const forRegExp = escape(match[0])
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

${  Object.keys(types).sort().map(t => 
      `type ${(types[t].name + T[types[t].Targs]).padEnd(maxLength)} = ${
        types[t].Targs ? '  ' : '_&'}${t + T[types[t].Targs]}`
    ).join('\n')}

` + jsm.trimStart()
  }
  console.log('exporting...')
  await rmd
  if (options.extraTypes)
  await fs.mkdir('./output/node_modules/@types/jsmextra', {recursive: true})
  await fs.mkdir('./output/node_modules/@types/graal',    {recursive: true})
  await fs.mkdir('./output/node_modules/@types/jsmacros', {recursive: true})
  await Promise.all([
    fs.writeFile(`./output/node_modules/@types/graal/Graal.d.ts`, graal),
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
    }, undefined, '  ')),
    ...(!options.extraTypes ? [] : [
      fs.copyFile('./JsmExtra.d.ts', './output/node_modules/@types/jsmextra/JsmExtra.d.ts'),
      fs.writeFile(`./output/node_modules/@types/jsmextra/package.json`, JSON.stringify({
        name: "@types/jsmextra",
        version: "1.0.0",
        description: "Extra TypeScript definitions for JsMacros",
        homepage: "https://github.com/aMelonRind/JsMacros-shared-script/tree/main/JsmTypes",
        license: "MIT",
        types: "JsmExtra.d.ts"
      }, undefined, '  '))
    ])
  ])
  console.log('done')
}

function escape(str = '') {
  return str.replace(/([\\\/^$\(\)\[\]\{\}\?\.\*\+\|])/g, '\\$1')
}

/**
 * possible, but not sure the values (or lazy):
 * OptionsHelper
 * StatsHelper
 * BlockPosHelper.offset()
 */
function getExtraTypesReplaces() {
  return {
    event:
`DimensionChange.dimension: string;
dimension: Dimension;
ArmorChange.slot: string;
slot: ArmorSlot;
InteractEntity.result: string;
result: ActionResult;
Heal.source: string;
source: HealSource;
OpenScreen.screenName: string;
screenName: ScreenName;
Title.type: string;
type: TitleType;
Damage.source: string;
source: DamageSource;
Sound.sound: string;
sound: Sound;
AttackBlock.side: number;
side: Side;
BlockUpdate.updateType: string;
updateType: BlockUpdateType;
EntityUnload.reason: string;
reason: EntityUnloadReason;
Bossbar.type: string;
type: BossBarUpdateType;
Key.action: number;
action: Bit;
Key.key: string;
key: Key;
Key.mods: string;
mods: KeyMods;
InteractBlock.result: string;
result: ActionResult;
InteractBlock.side: number;
side: Side;
ClickSlot.mode: number;
mode: Septit;
ClickSlot.button: number;
button: ClickSlotButton;`.split('\n'),
    library:
`Player.getGameMode(): string;
getGameMode(): Gamemode;
KeyBind.getKeyCode(keyName: string): /* minecraft classes, as any, because obfuscation: */ any;
getKeyCode(keyName: Key): /* minecraft classes, as any, because obfuscation: */ any;
KeyBind.getKeyBindings(): _javatypes.java.util.Map<string, string>;
getKeyBindings(): _javatypes.java.util.Map<Bind, Key>;
KeyBind.setKeyBind(bind: string, key: string): void;
setKeyBind(bind: Bind, key: Key): void;
KeyBind.key(keyName: string, keyState: boolean): void;
key(keyName: Key, keyState: boolean): void;
KeyBind.keyBind(keyBind: string, keyState: boolean): void;
keyBind(keyBind: Bind, keyState: boolean): void;
KeyBind.getPressedKeys(): _javatypes.java.util.Set<string>;
getPressedKeys(): _javatypes.java.util.Set<Key>;
Hud.getOpenScreenName(): string;
getOpenScreenName(): ScreenName;
World.findBlocksMatching(centerX: number, centerZ: number, id: string, chunkrange: number): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D>;
findBlocksMatching(centerX: number, centerZ: number, id: BlockId, chunkrange: number): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D>;
World.findBlocksMatching(id: string, chunkrange: number): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D>;
findBlocksMatching(id: BlockId, chunkrange: number): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D>;
World.findBlocksMatching(ids: string[], chunkrange: number): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D>;
findBlocksMatching(ids: BlockId[], chunkrange: number): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D>;
World.findBlocksMatching(centerX: number, centerZ: number, ids: string[], chunkrange: number): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D>;
findBlocksMatching(centerX: number, centerZ: number, ids: BlockId[], chunkrange: number): _javatypes.java.util.List<_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D>;
World.getDimension(): string;
getDimension(): Dimension;
World.getBiome(): string;
getBiome(): Biome;
World.getDifficulty(): number;
getDifficulty(): Difficulty;
World.getBiomeAt(x: number, z: number): string;
getBiomeAt(x: number, z: number): Biome;`.split('\n'),
    helper:
`BossBarHelper.getColor(): string;
getColor(): BossBarColor;
BossBarHelper.getStyle(): string;
getStyle(): BossBarStyle;
RecipeHelper.getId(): string;
getId(): RecipeId;
BlockDataHelper.getId(): string;
getId(): BlockId;
PlayerListEntryHelper.getGamemode(): string;
getGamemode(): Gamemode;
StyleHelper.getClickAction(): string;
getClickAction(): TextClickAction;
StyleHelper.getHoverAction(): string;
getHoverAction(): TextHoverAction;
ClientPlayerEntityHelper.getItemCooldownsRemainingTicks(): _javatypes.java.util.Map<string, number>;
getItemCooldownsRemainingTicks(): _javatypes.java.util.Map<ItemId, number>;
ClientPlayerEntityHelper.getItemCooldownRemainingTicks(item: string): number;
getItemCooldownRemainingTicks(item: ItemId): number;
ClientPlayerEntityHelper.getTicksSinceCooldownsStart(): _javatypes.java.util.Map<string, number>;
getTicksSinceCooldownsStart(): _javatypes.java.util.Map<ItemId, number>;
ClientPlayerEntityHelper.getTicksSinceCooldownStart(item: string): number;
getTicksSinceCooldownStart(item: ItemId): number;
EntityHelper.getType(): string;
getType(): EntityId;
ItemStackHelper.getItemId(): string;
getItemId(): ItemId;
ItemStackHelper.getTags(): _javatypes.java.util.List<string>;
getTags(): _javatypes.java.util.List<ItemTag>;
BlockHelper.getTags(): _javatypes.java.util.List<string>;
getTags(): _javatypes.java.util.List<BlockTag>;
BlockHelper.getId(): string;
getId(): BlockId;
BlockStateHelper.getPistonBehaviour(): string;
getPistonBehaviour(): PistonBehaviour;
BlockStateHelper.allowsSpawning(pos: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.BlockPosHelper, entity: string): boolean;
allowsSpawning(pos: _javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.BlockPosHelper, entity: string): boolean;
VillagerEntityHelper.getProfession(): string;
getProfession(): VillagerProfession;
VillagerEntityHelper.getStyle(): string;
getStyle(): VillagerStyle;
StatusEffectHelper.getId(): string;
getId(): StatusEffectId;`.split('\n'),
    class:
`Inventory.click(slot: number, mousebutton: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<T>;
click(slot: number, mousebutton: Bit): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<T>;
Inventory.dragClick(slots: number[], mousebutton: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<T>;
dragClick(slots: number[], mousebutton: Bit): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<T>;
Inventory.quickAll(slot: number, button: number): number;
quickAll(slot: number, button: Bit): number;
Inventory.swapHotbar(slot: number, hotbarSlot: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<T>;
swapHotbar(slot: number, hotbarSlot: HotbarSlot | OffhandSlot): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<T>;
Inventory.getSelectedHotbarSlotIndex(): number;
getSelectedHotbarSlotIndex(): HotbarSlot;
Inventory.setSelectedHotbarSlotIndex(index: number): void;
setSelectedHotbarSlotIndex(index: HotbarSlot): void;
Inventory.getType(): string;
getType(): InventoryType;
TextBuilder.withClickEvent(action: string, value: string): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.TextBuilder;
withClickEvent(action: TextClickAction, value: string): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.TextBuilder;`.split('\n'),
    worldscanner:
`WorldScannerBuilder.equals(args: string[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
equals(args: BlockId[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
WorldScannerBuilder.contains(args: string[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
contains(args: BlockId[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
WorldScannerBuilder.startsWith(args: string[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
startsWith(args: BlockId[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
WorldScannerBuilder.endsWith(args: string[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
endsWith(args: BlockId[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
WorldScannerBuilder.matches(args: string[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;
matches(args: BlockId[]): _javatypes.xyz.wagyourtail.jsmacros.client.api.classes.worldscanner.WorldScannerBuilder;`.split('\n'),
    sharedinterfaces:
`IDraw2D.addItem(x: number, y: number, id: string): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, id: ItemId): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
IDraw2D.addItem(x: number, y: number, zIndex: number, id: string): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, zIndex: number, id: ItemId): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
IDraw2D.addItem(x: number, y: number, id: string, overlay: boolean): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, id: ItemId, overlay: boolean): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
IDraw2D.addItem(x: number, y: number, zIndex: number, id: string, overlay: boolean): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, zIndex: number, id: ItemId, overlay: boolean): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
IDraw2D.addItem(x: number, y: number, id: string, overlay: boolean, scale: number, rotation: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, id: ItemId, overlay: boolean, scale: number, rotation: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
IDraw2D.addItem(x: number, y: number, zIndex: number, id: string, overlay: boolean, scale: number, rotation: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, zIndex: number, id: ItemId, overlay: boolean, scale: number, rotation: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
IScreen.getScreenClassName(): string;
getScreenClassName(): ScreenClass;
IScreen.addItem(x: number, y: number, id: string): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, id: ItemId): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
IScreen.addItem(x: number, y: number, id: string, overlay: boolean): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, id: ItemId, overlay: boolean): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
IScreen.addItem(x: number, y: number, id: string, overlay: boolean, scale: number, rotation: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
addItem(x: number, y: number, id: ItemId, overlay: boolean, scale: number, rotation: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;`.split('\n'),
    sharedclasses:
`RenderCommon$Item.setItem(id: string, count: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;
setItem(id: ItemId, count: number): _javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.RenderCommon$Item;`.split('\n')
  }
}
