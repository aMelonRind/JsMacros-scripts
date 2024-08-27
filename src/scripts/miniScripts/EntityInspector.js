//@ts-check
// able to get entity info/item
// look at entity, use alt + middle mouse to trigger
JsMacros.assertEvent(event, 'Service')
module.exports = 0

if (!World.isWorldLoaded())
  JsMacros.waitForEvent('ChunkLoad')

const LivingEntityHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.LivingEntityHelper')

let lastNbtPath = ''
let inspectSelf = false

JsMacros.on('Key', JavaWrapper.methodToJava(e => {
  if (e.key !== 'key.mouse.middle'
  ||  !e.mods.endsWith('alt')
  ||  e.action !== 1
  ||  Hud.getOpenScreen()) return
  const p = Player.getPlayer()
  if (p?.getPitch() === 90) {
    if (inspectSelf) {
      inspectSelf = false
      openEntityInspectScreen(p)
    } else {
      inspectSelf = true
    }
    return
  }
  inspectSelf = false
  const trace = Player.rayTraceEntity(64)
  if (!trace) return
  openEntityInspectScreen(trace)
}))

/**
 * @param {EntityHelper} entity 
 * @returns 
 */
function openEntityInspectScreen(entity) {
  if (!entity) return
  const sc = Hud.createScreen('Entity Inspector', false)
  sc.setOnInit(JavaWrapper.methodToJava(() => {
    const width = sc.getWidth()
    const cx = Math.floor(width / 2)
    const cy = Math.floor(sc.getHeight() / 2)
    // add title
    const title = Chat.createTextBuilder().append('Inspecting ').append(entity.getName()).build()
    sc.addText(title, cx - Math.floor(title.getWidth() / 2), cy - 50, 0xFFFFFF, true)
    // add entity type
    const type = entity.getType()
    sc.addText(type, cx - Math.floor(Chat.getTextWidth(type) / 2), cy - 40, 0xAFAFAF, true)
    if (entity instanceof LivingEntityHelper) {
      // add armoritems
      addItem(sc, cx - 35, cy - 28, entity.getHeadArmor(),  'No Helmet!')
      addItem(sc, cx - 17, cy - 28, entity.getChestArmor(), 'No Chestplate!')
      addItem(sc, cx +  1, cy - 28, entity.getLegArmor(),   'No Leggings!')
      addItem(sc, cx + 19, cy - 28, entity.getFootArmor(),  'No Boots!')
      // add handitems
      const handsX = [cx + 19, cx - 35]
      if (!Client.getGameOptions().getSkinOptions().isRightHanded()) handsX.reverse()
      addItem(sc, handsX[0], cy - 8, entity.getMainHand(), 'No MainHand Item!')
      addItem(sc, handsX[1], cy - 8, entity.getOffHand(),  'No OffHand Item!')
    }
    // item frame
    if (entity.is('item_frame', 'glow_item_frame')) {
      addItem(sc, cx - 7, cy - 28, entity.getItem(), 'No Framed Item!')
    }
    // add nbt inspector
    // might do syntax highlighting and multi line in the future..
    // doubt that it's needed tho.
    const nbtOutput = sc.addText('NBT Inspector', cx - 78, cy + 36, 0xFFFFFF, true)
    const nbtInput = sc.addTextInput(cx - 80, cy + 16, 160, 16, '',
      JavaWrapper.methodToJava(txt => {
        lastNbtPath = txt
        if (txt === '') return putNbtOutput(nbtOutput, width, 'NBT Inspector')
        /** @type {NBTElementHelper} */
        let nbt = entity.getNBT()
        const path = txt.split(/[\.\[\]\s]/).filter(v => v)
        let pop = path.pop()
        if (!pop) {
          return putNbtOutput(nbtOutput, width, 'NBT Inspector')
        } else if (/^\d+$/.test(pop)) {
          path.push(pop)
          pop = undefined
        }
        try {
          for (const key of path.map(v => /^\d+$/.test(v) ? parseInt(v) : v)) {
            //@ts-ignore
            nbt = nbt.get(key)
          }
        } catch (e) {
          return putNbtOutput(nbtOutput, width, "can't parse output: " + e.message)
        }
        /** @type {NBTElementHelper | string | null} */
        let snbt = nbt
        if (snbt?.isCompound() && pop) {
          const keys = snbt.getKeys()
          if (keys.contains(pop)) {
            snbt = snbt.get(pop)
          } else {
            const lcpop = pop.toLowerCase()
            const filtered = keys.toArray().filter(k => k.toLowerCase().startsWith(lcpop))
            if (filtered.length === 1) {
              snbt = snbt.get(filtered[0])
              if (lastNbtPath.endsWith(' ')) // press space to autocomplete
              nbtInput.setText(lastNbtPath.trimEnd().slice(0, -pop.length) + filtered[0] + '.')
            }
            else snbt = filtered.join(', ')
          }
        }
        if (typeof snbt === 'string') {}
        else if (!snbt)             snbt = 'undefined'
        else if (snbt.isCompound()) snbt = snbt.asString()
        else if (snbt.isString())   snbt = snbt.asString()
        else if (snbt.isNumber())   snbt = snbt.asNumber().toString()
        else if (snbt.isList())     snbt = snbt.asListHelper().asUUID()?.toString() ?? snbt.asString()
        else if (snbt.isNull())     snbt = 'null'
        else snbt = snbt.toString()
        putNbtOutput(nbtOutput, width, `${snbt}`)
      })
    ).setText(lastNbtPath)
  }))
  Hud.openScreen(sc)
}

/**
 * add an item with hover event and click event
 * @param {ScriptScreen} sc 
 * @param {number} x 
 * @param {number} y 
 * @param {ItemStackHelper} item 
 * @param {string} textIfEmpty 
 */
function addItem(sc, x, y, item, textIfEmpty = 'No Item!') {
  const builder = Chat.createTextBuilder().append('空空')
  if (!item || item.isEmpty()) {
    sc.addItem(x, y, 'minecraft:barrier')
    builder.withShowTextHover(Chat.createTextHelperFromString(textIfEmpty))
  } else {
    sc.addItem(x, y, item)
    builder.withShowItemHover(item).withCustomClickEvent(JavaWrapper.methodToJava(getItem(item)))
  }
  const txt = builder.build()
  sc.addText(txt, x - 2, y - 2, 0x05000000, false)
  sc.addText(txt, x - 2, y + 6, 0x05000000, false)
}

/**
 * @param {ItemStackHelper} item 
 */
function getItem(item) {
  return () => {
    if (Player.getGameMode() === 'creative') {
      const InvScreen = Java.type('net.minecraft.class_490')
      const Inventory = Java.type('xyz.wagyourtail.jsmacros.client.api.classes.inventory.Inventory')
      const inv = Inventory.create(new InvScreen(Player.getPlayer()?.getRaw()))
      const slot = inv?.getSlots('hotbar', 'main').find(slot => {
        return inv.getSlot(slot).isEmpty()
      })
      if (slot !== undefined) {
        const CreativeInventoryActionC2SPacket = Java.type("net.minecraft.class_2873")
        Client.sendPacket(new CreativeInventoryActionC2SPacket(slot, item.getRaw()))
        return
      }
    } else if (Player.getPlayer()?.getRaw().method_5687(2)) { // .hasPermissionLevel
      return Chat.say(`/give @s ${item.getItemId()}${item.getNBT().asString()}`)
    }

    Chat.log(
      Chat.createTextBuilder()
        .append("Don't have /give permission to get ").append(item.getName()).append('\n')
        .append('Click here to copy tags to clipboard.')
        .withClickEvent('COPY_TO_CLIPBOARD', `${item.getItemId()}${item.getNBT().asString().replace(/"/g, '\\"')}`)
    )
  }
}

/**
 * @param {Text} out 
 * @param {number} maxwidth 
 * @param {string} str 
 */
function putNbtOutput(out, maxwidth, str) {
  maxwidth -= 20
  if (Chat.getTextWidth(str) > maxwidth) {
    let err = Math.floor(str.length / 2)
    let index = str.length
    while (err > 1) {
      if (Chat.getTextWidth(str.slice(0, index - err)) > maxwidth) {
        index -= err
      }
      err = Math.floor(err / 2)
    }
    str = str.slice(0, index)
  }
  out.setText(str).alignHorizontally('center')
}
