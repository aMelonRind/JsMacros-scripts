
// show armor, hand and inventory space info
// is service

const POSITION = (width, height) => ({
  x: Math.floor(width / 2) - 179,
  y: height - 72
})

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')
const d2d = Hud.createDraw2D()
const orig = {d2dsize: {w: -1, h: -1}, x: 0, y: 0}
const idx = {helm: 0, ches: 1, legg: 2, boot: 3, off: 4, main: 5, inv: 6}
const enabled = [false, false, false, false, false, false, true]
const Elements = []
enabled.forEach(() => Elements.push(d2d.addItem(0, 0, 'air')))
enabled.forEach(() => Elements.push(d2d.addText('----', 0, 0, 0xFFFFFF, true)))

d2d.setOnInit(JavaWrapper.methodToJava(() => {
  if (orig.d2dsize.w !== d2d.getWidth() || orig.d2dsize.h !== d2d.getHeight()) {
    orig.d2dsize.w = d2d.getWidth()
    orig.d2dsize.h = d2d.getHeight();
    ({x: orig.x, y: orig.y} = POSITION(orig.d2dsize.w, orig.d2dsize.h))
    Elements[0].x  = Elements[1].x  =  Elements[2].x  =  Elements[3].x  = orig.x
    Elements[7].x  = Elements[8].x  =  Elements[9].x  =  Elements[10].x = orig.x + 18
    Elements[4].x  = Elements[5].x  =  Elements[6].x  =  orig.x + 44
    Elements[11].x = Elements[12].x =  Elements[13].x =  orig.x + 62
    Elements[0].y  = Elements[4].y  = (Elements[1].y  =  Elements[5].y  =
                    (Elements[2].y  =  Elements[6].y  = (Elements[3].y  = orig.y + 54) - 18) - 18) - 18
    Elements[7].y  = Elements[11].y = (Elements[8].y  =  Elements[12].y =
                    (Elements[9].y  =  Elements[13].y = (Elements[10].y = orig.y + 58) - 18) - 18) - 18
  }
  enabled.forEach((v, i) => {
    if (!v) return
    d2d.reAddElement(Elements[i])
    d2d.reAddElement(Elements[i + 7])
  })
}))

function renderUpdate(index, text = null, item = null, color = 0xf) {
  if (text === null) {
    if (!enabled[index]) return
    d2d.removeElement(Elements[index])
    d2d.removeElement(Elements[+index + 7])
    enabled[index] = false
    return
  }

  const i = item ?? 'air'
  if (typeof i === 'string') Elements[index].setItem(i, 1)
  else Elements[index].setItem(i)
  Elements[index].overlay = !(typeof i === 'string' || item.getCount() > 1)
  Elements[+index + 7].setText(Chat.createTextBuilder().append(`${text}`).withColor(color).build())

  if (enabled[index]) return
  d2d.reAddElement(Elements[index])
  d2d.reAddElement(Elements[+index + 7])
  enabled[index] = true
}

/**
   * 
   * @param {Number} index 
   * @param {Java.xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper} item 
   * @returns 
   */
function updateItem(index, item) {
  // === for Fallout's invisible armor
  if ([idx.helm, idx.ches, idx.legg, idx.boot].includes(index))
  if (item.getName().getString().startsWith('已隱藏-')) {
    const count = item.getCount()
    if (count === 100) return renderUpdate(index, null)
    return renderUpdate(index, `${count > 90 ? 100 - count : count}%`, item, !(count > 90) ? (count < 10 ? 0xc : 0xf) : 0xa)
  }
  // ===

  let text = 0
  if (item.isDamageable()) {
    text = item.getDamage()
    if (text === 0) return renderUpdate(index, null)
    const maxdmg10 = Math.ceil(item.getMaxDamage() / 10)
    if (text < maxdmg10) return renderUpdate(index, `-${text}`, item, 0xa)
    text = item.getMaxDamage() - text
    return renderUpdate(index, `${text}`, item, text > maxdmg10 ? 0xf : 0xc)
  }

  if ([idx.main, idx.off].includes(index) && item.getItemId() !== 'minecraft:air' && World.isWorldLoaded() && !loading) {
    const inv = openSurvivalInv()
    if (!inv) return
    mergeMap(inv.getMap(), ['main', 'hotbar', 'offhand']).map(i => inv.getSlot(i)).forEach(i => {
      if (i.isItemEqual(item) && i.isNBTEqual(item)) text += i.getCount()
    })
    if (text > 1) return renderUpdate(index, text, item)
  }

  text = item.getCount()
  if (text === 0) return renderUpdate(index, null)
  else if (text === 1) text = ''
  renderUpdate(index, text, item)
}

const StringNbtReader = Java.type('net.minecraft.class_2522')
const ItemStack = Java.type('net.minecraft.class_1799')
const ItemStackHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper')

function getBundle(count) {
  return new ItemStackHelper(ItemStack.method_7915(StringNbtReader.method_10718(`{
    id: "minecraft:bundle",
    Count: 1,
    tag: {
      Items:[
        {id: "minecraft:stone", Count: ${count}}
      ]
    }
  }`))) // ItemStack.fromNbt(StringNbtReader.parse())
}

const wrappedUpdate = JavaWrapper.methodToJava(_update)
let nextTick = false
let flags = 0
/**
 * @param {number} flag bitfield  4: armor, 2: hands, 1: empty slot count
 */
function updateNextTick(flag = 0) {
  flags = flags | flag
  if (nextTick || !flags) return
  nextTick = true
  JsMacros.once('Tick', wrappedUpdate)
}
/**
 * @param {number} flag bitfield  4: armor, 2: hands, 1: empty slot count
 */
const wrapNextTick = (flag) => JavaWrapper.methodToJava(() => {updateNextTick(flag)})
function _update() {
  nextTick = false
  if (!flags || !World.isWorldLoaded() || loading || !rendering) return

  const inv = openSurvivalInv()
  if (!inv) return
  const map = inv.getMap()
  if (flags & 4) {
    updateItem(idx.helm, inv.getSlot(map.helmet[0]))
    updateItem(idx.ches, inv.getSlot(map.chestplate[0]))
    updateItem(idx.legg, inv.getSlot(map.leggings[0]))
    updateItem(idx.boot, inv.getSlot(map.boots[0]))
  }
  if (flags & 2) {
    updateItem(idx.off,  inv.getSlot(map.offhand[0]))
    updateItem(idx.main, inv.getSlot(map.hotbar[inv.getSelectedHotbarSlotIndex()]))
  }
  if (flags & 1) {
    const count = mergeMap(map).reduce((p, i) => p + inv.getSlot(i).isEmpty(), 0)
    renderUpdate(idx.inv, count, getBundle(Math.floor((1 - count / 36) * 64)))
  }
  flags = 0
}

const InvScreen = Java.type('net.minecraft.class_490')
const Inventory = Java.type('xyz.wagyourtail.jsmacros.client.api.classes.Inventory')

/**
 * Opens Survival Inventory regardless if there's any screen open
 * @returns {Java.xyz.wagyourtail.jsmacros.client.api.classes.Inventory}
 */
function openSurvivalInv() {
  return Inventory.create(new InvScreen(Player.getPlayer()?.getRaw()))
}

function mergeMap(map, keys = ['main', 'hotbar']) {
  return keys.reduce((p, key) => map[key] ? p.concat(Java.from(map[key])) : p, [])
}

let enableListeners = () => {
  enableListeners = () => null // self destruct, just in case
  JsMacros.on('HeldItemChange', wrapNextTick(3))
  JsMacros.on('ItemPickup',     wrapNextTick(3))
  JsMacros.on('ClickSlot',      wrapNextTick(3))
  JsMacros.on('DropSlot',       wrapNextTick(3))
  JsMacros.on('ArmorChange',    JavaWrapper.methodToJava(e => updateItem(['HEAD', 'CHEST', 'LEGS', 'FEET'].indexOf(e.slot), e.item)))
}

let rendering = false, loading = false
if (World.isWorldLoaded()) {
  enableListeners()
  d2d.register()
  rendering = true
  updateNextTick(7)
}

JsMacros.on('DimensionChange', JavaWrapper.methodToJava(() => {
  loading = true
  JsMacros.once('ChunkLoad', JavaWrapper.methodToJava(() => {
    loading = false
    updateNextTick(7)
    
    if (!rendering) {
      enableListeners()
      d2d.register()
      rendering = true
    }
  }))
}))

JsMacros.on('OpenScreen', JavaWrapper.methodToJava(e => {
  if (e.screenName === 'Chat') { // hide the HUD while Chat is open since draw2d item will cover some chat text
    if (!rendering) return
    d2d.unregister()
    rendering = false
    return
  }

  updateNextTick(7)

  if (rendering) return
  d2d.register()
  rendering = true
}))

event.stopListener = JavaWrapper.methodToJava(() => {
  d2d.unregister()
})
