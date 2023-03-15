
const fromEnum = {
  Gamemode:           'class_1934.method_8381',
  ActionResult:       'class_1269.toString',
  DamageSource:       'class_1282.method_5525',
  PistonBehaviour:    'class_3619.toString',
  EntityUnloadReason: 'class_1297$class_5529.toString',
  BossBarColor:       'class_1259$class_1260.method_5421.toUpperCase',
  BossBarStyle:       'class_1259$class_1261.method_5425.toUpperCase',
  TextClickAction:    'class_2558$class_2559.method_10846',
  TextHoverAction:    'class_2568$class_5247.method_27674',
  VillagerStyle:      'class_3854.toString',
  VillagerProfession: 'class_3852.comp_818'
}

// https://fabricmc.net/wiki/tutorial:registry_types
const fromRegistry = {
  Biome:          'field_25933', // is changing in 1.19.4 probably
  Sound:          'field_11156',
  ItemId:         'field_11142',
  BlockId:        'field_11146',
  EntityId:       'field_11145',
  // RecipeId:       'field_17597', // don't know how
  Dimension:      'field_38009',
  // ScreenClass:    'field_17429', // doesn't work
  StatusEffectId: 'field_11159'
}

/** others
 * 
 *  class_3675
 * Key
 *  Java.from(Client.getGameOptions().getRaw().field_1839).map(k => k.method_1431())
 *  option.allKeys.map(key.getTranslationKey())
 * Bind
 *  collect through items
 * ItemTag
 *  collect through blocks
 * BlockTag
 *  s.getClass().getName()
 *  s.getTitle()
 * ScreenName
 *  same as screenName but check if is container
 * InventoryType
 */

let file = `
type Bit    = 1 | 0
type Trit   = 2 | Bit
type Dit    = 3 | Trit
type Pentit = 4 | Dit
type Hexit  = 5 | Pentit
type Septit = 6 | Hexit
type Octit  = 7 | Septit

type Side = Hexit
type HotbarSlot = Octit | 8
type ClickSlotButton = HotbarSlot | 9 | 10 | OffhandSlot
type OffhandSlot = 40
type Difficulty = Dit

type HealSource = DamageSource

type KeyMods =
| 'key.keyboard.left.shift'
| 'key.keyboard.left.control'
| 'key.keyboard.left.alt'
| 'key.keyboard.left.shift+key.keyboard.left.control'
| 'key.keyboard.left.shift+key.keyboard.left.alt'
| 'key.keyboard.left.control+key.keyboard.left.alt'
| 'key.keyboard.left.shift+key.keyboard.left.control+key.keyboard.left.alt'
type ArmorSlot = 'HEAD' | 'CHEST' | 'LEGS' | 'FEET'
type TitleType = 'TITLE' | 'SUBTITLE' | 'ACTIONBAR'
type BlockUpdateType = 'STATE' | 'ENTITY'
type BossBarUpdateType = 'ADD' | 'REMOVE' | 'UPDATE_PERCENT'
| 'UPDATE_NAME' | 'UPDATE_STYLE' | 'UPDATE_PROPERTIES'

type HandledScreenName =
| '1 Row Chest'
| '2 Row Chest'
| '3 Row Chest'
| '4 Row Chest'
| '5 Row Chest'
| '6 Row Chest'
| '3x3 Container'
| 'Anvil'
| 'Beacon'
| 'Blast Furnace'
| 'Brewing Stand'
| 'Crafting Table'
| 'Enchanting Table'
| 'Furnace'
| 'Grindstone'
| 'Hopper'
| 'Loom'
| 'Villager'
| 'Shulker Box'
| 'Smithing Table'
| 'Smoker'
| 'Cartography Table'
| 'Stonecutter'
| 'Survival Inventory'
| 'Horse'
| 'Creative Inventory'

//--- runtime generates
// class_3675
type Key = string
// Java.from(Client.getGameOptions().getRaw().field_1839).map(k => k.method_1431())
// option.allKeys.map(key.getTranslationKey())
type Bind = string
// Registry.field_25933
type Biome = string
// Registry.field_11156
type Sound = string
// Registry.field_11142
type ItemId = string
// collect through items
type ItemTag = string
// Registry.field_11146
type BlockId = string
// collect through blocks
type BlockTag = string
// Registry.field_11145
type EntityId = string
// Registry.field_17597
type RecipeId = string
// class_1934.method_8381
type Gamemode = string
// Registry.field_25490
type Dimension = string
// s.getClass().getName()
// s.getTitle()
type ScreenName =// string
| HandledScreenName
| 'unknown'
// | ScreenClass
// Registry.field_17429
type ScreenClass = string
// class_1269.toString
type ActionResult = string
// class_1282.method_5525
type DamageSource = string
// same as screenName but check if is container
type InventoryType =// string
| HandledScreenName
// Registry.field_11159
type StatusEffectId = string
// class_3619.toString
type PistonBehaviour = string
// class_1297$class_5529.toString
type EntityUnloadReason = string
// class_1259$class_1260.method_5421.toUpperCase
type BossBarColor = string
// class_1259$class_1261.method_5425.toUpperCase
type BossBarStyle = string
// class_2558$class_2559.method_10846
type TextClickAction = string
// class_2568$class_5247.method_27674
type TextHoverAction = string
// class_3854.toString
type VillagerStyle = string
// class_3852.comp_818
type VillagerProfession = string
`

// > (Note: For version 1.19.3 and above, please replace Registry with Registries.)
const Registry = Java.type('net.minecraft.class_2378')
const BuiltinRegistries = Java.type('net.minecraft.class_5458')

const wordReg = /^\w+$/
const classReg = /^[\w$]+ \((\w+)\)$/
const call = (f, methods) => {
  for (const method of methods) {
    if (!f || (typeof f === 'object' && !(method in f))) return null
    f = f[method]()
  }
  return f
}

const typeReg = type => RegExp(`(?<=type *${type} *=) *string *(?:\n(?=\|))?`)
const replaceToFile = type => {
  let res = ''
  if (!temp.length) res = ' string // not found'
  else if (temp.reduce((p, v) => p + v.length, 0) < 64)
       res = temp.map(f =>    " '" + f + "'").join(' |')
  else res = temp.map(f => "\n| '" + f + "'").join('')
  file = file.replace(typeReg(type), res + '\n')
}

log('start')
let temp
log('fetching Enum')
for (const type in fromEnum) {
  const methods = fromEnum[type].split('.')
  const className = methods.shift()
  const Clazz = Java.type('net.minecraft.' + className)
  temp = Object.values(Clazz)
    .filter(f => f instanceof Clazz)
    .map(f => call(f, methods))
    .sort()
    .filter((v, i, a) => v && v !== a[i - 1])
  replaceToFile(type)
  log(`fetched ${temp.length} enums for ${type}`)
}

log('fetching Registry')
for (const type in fromRegistry) {
  temp = Java.from((fromRegistry[type] in Registry ? Registry : BuiltinRegistries)
    [fromRegistry[type]].method_10235().toArray()) // .getIds()
    .map(id => id.toString())
    .sort()
    .filter((v, i, a) => v && v !== a[i - 1])
  replaceToFile(type)
  log(`fetched ${temp.length} ids for ${type}`)
}

log('fetching others')

const InputUtil = Java.type('net.minecraft.class_3675')
const InputUtil$Type = Java.type('net.minecraft.class_3675$class_307')

temp = []
for (const f in InputUtil) {
  if (typeof InputUtil[f] === 'number') temp.push(InputUtil[f])
}
temp = temp
  .sort((a, b) => a - b)
  .filter((v, i, a) => v !== a[i - 1])
  .map(code => InputUtil$Type[code <= 7 ? 'field_1672' : 'field_1668'].method_1447(code))
  .filter(k => k !== InputUtil.field_16237)
  .map(k => k.method_1441())
  .sort()
const commonRegex = /^key\.keyboard\.[a-z0-9]$/
const funcRegex   = /^key\.keyboard\.f([0-9]{1,2})$/
const groupRegex  = /^key\.keyboard\.(?:keypad|left|right)\./
temp = temp // order
  .filter(k => funcRegex.test(k))
  .sort((a, b) => a.match(funcRegex)[1] - b.match(funcRegex)[1])
  .concat(temp.filter(k => commonRegex.test(k)))
  .concat(temp.filter(k => groupRegex.test(k)))
  .concat(temp.filter(k => !funcRegex.test(k) && !commonRegex.test(k) && !groupRegex.test(k)))
replaceToFile('Key')
log(`fetched ${temp.length} keys for Key`)

temp = Java.from(Client.getGameOptions().getRaw().field_1839).map(k => k.method_1431())
replaceToFile('Bind')
log(`fetched ${temp.length} keybinds for Bind`)

const ItemStackHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper')
const ItemRegistry = Registry.field_11142
temp = Java.from(ItemRegistry.method_10235().toArray())
  .map(id => new ItemStackHelper(ItemRegistry.method_10223(id).method_7854()).getTags())
  .flat()
  .sort()
  .filter((v, i, a) => v !== a[i - 1])
replaceToFile('ItemTag')
log(`fetched ${temp.length} tags for ItemTag`)

const BlockHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.BlockHelper')
const BlockRegistry = Registry.field_11146
temp = Java.from(BlockRegistry.method_10235().toArray())
  .map(id => new BlockHelper(BlockRegistry.method_10223(id)).getTags())
  .flat()
  .sort()
  .filter((v, i, a) => v !== a[i - 1])
replaceToFile('BlockTag')
log(`fetched ${temp.length} tags for BlockTag`)

FS.open('./JsmExtra.d.ts').write(file)
log('exported')

function log(msg) {
  Chat.log('[JsmExtra] ' + msg)
}
