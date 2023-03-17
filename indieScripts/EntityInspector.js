
// able to get entity info/item
// look at entity, use alt + middle mouse to trigger
// is service

JsMacros.on('Key', JavaWrapper.methodToJava(e => {
  if (e.key !== 'key.mouse.middle'
  ||  !e.mods.endsWith('alt')
  ||  Hud.getOpenScreen()) return
  const trace = Player.rayTraceEntity(64)
  if (!trace) return
  openEntityInspectScreen(trace)
}))

const LivingEntityHelper = Reflection.getClass(
  'xyz.wagyourtail.jsmacros.client.api.helpers.LivingEntityHelper',
  'xyz.wagyourtail.jsmacros.client.api.helpers.world.entity.LivingEntityHelper'
)
const NBTElementHelper   = Reflection.getClass(
  'xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper',
  'xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper'
)
const ItemStackHelper    = Reflection.getClass(
  'xyz.wagyourtail.jsmacros.client.api.helpers.ItemStackHelper',
  'xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper'
)
const ItemStack          = Java.type('net.minecraft.class_1799')

/** @type {(text: string) => number} mc.textRenderer.getWidth */
const getTextWidth = Client.getMinecraft().field_1772.method_1727
/** @type {ScriptScreen} */
let sc
let lastNbtPath = ''

/**
 * 
 * @param {LivingEntityHelper} entity 
 * @returns 
 */
function openEntityInspectScreen(entity) {
  if (!entity) return
  sc = Hud.createScreen('Entity Inspector', false)
  sc.setOnInit(JavaWrapper.methodToJava(() => {
    const cx = Math.floor(sc.getWidth()  / 2)
    const cy = Math.floor(sc.getHeight() / 2)
    // add title
    const title = Chat.createTextHelperFromJSON(`{
      "text": "Inspecting ",
      "extra": [${entity.getName().getJson()}]
    }`)
    sc.addText(
      title,
      cx - Math.floor(getTextWidth(title.getStringStripFormatting()) / 2),
      cy - 50,
      0xFFFFFF,
      true
    )
    // add entity type
    sc.addText(
      entity.getType(),
      cx - Math.floor(getTextWidth(entity.getType()) / 2),
      cy - 40,
      0xAFAFAF,
      true
    )
    if (entity instanceof LivingEntityHelper) {
      // add armoritems
      addItem(cx - 35, cy - 28, entity.getHeadArmor(),  'No Helmet!')
      addItem(cx - 17, cy - 28, entity.getChestArmor(), 'No Chestplate!')
      addItem(cx +  1, cy - 28, entity.getLegArmor(),   'No Leggings!')
      addItem(cx + 19, cy - 28, entity.getFootArmor(),  'No Boots!')
      // add handitems
      const handsX = [cx - 35, cx + 19]
      if (Client.getGameOptions().isRightHanded()) handsX.reverse()
      addItem(handsX[0], cy - 8, entity.getMainHand(), 'No MainHand Item!')
      addItem(handsX[1], cy - 8, entity.getOffHand(),  'No OffHand Item!')
    }
    // add nbt inspector
    const nbtOutput = sc.addText('NBT Inspector', cx - 78, cy + 36, 0xFFFFFF, true)
    const nbtInput = sc.addTextInput(cx - 80, cy + 16, 160, 16, '',
      JavaWrapper.methodToJava(txt => {
        lastNbtPath = txt
        if (txt === '') return nbtOutput.setText('NBT Inspector')
        /** @type {NBTElementHelper} */
        let nbt = entity.getNBT()
        const path = txt.split(/[\.\[\]\s]/).filter(v => v)
        try {
          while (nbt && (path[1] || /^\d+$/.test(path[0]))) {
            if (/^\d+$/.test(path[0])) nbt = nbt.get(parseInt(path.shift()))
            else nbt = nbt.get(path.shift())
          }
        }catch(e) {
          return nbtOutput.setText("can't parse output: " + e.message)
        }
        if (nbt?.isCompound() && path[0]) {
          const keys = nbt.getKeys()
          if (keys.contains(path[0])) nbt = nbt.get(path[0])
          else {
            const filtered = keys.toArray().filter(k => k.startsWith(path[0]))
            if (filtered.length === 1) {
              nbt = nbt.get(filtered[0])
              if (lastNbtPath.endsWith(' ')) // press space to autocomplete
              nbtInput.setText(lastNbtPath.trimEnd() + filtered[0].slice(path[0].length) + '.')
            }
            else nbt = filtered.join(', ')
          }
        }
        if (typeof nbt === 'string');
        else if (!nbt)                 nbt = 'null'
        else if (nbt.isCompound())     nbt = nbt.toString()
        // else if (nbt.isPossiblyUUID()) nbt = nbt.asUUID().toString()
        else if (nbt.isList())         nbt = nbt.toString()
        else if (nbt.isNull())         nbt = 'null'
        else if (nbt.isNumber())       nbt = nbt.asNumber()
        else if (nbt.isString())       nbt = nbt.asString()
        else nbt = nbt.toString()
        if (nbt?.startsWith?.('NBT')) nbt = toSnbt(nbt)
        nbtOutput.setText(`${nbt}`)
      })
    ).setText(lastNbtPath)
    // extra: item frame
    if (entity.getType().endsWith('item_frame'))
      addItem(cx - 7, cy - 28, entity.getNBT().get('Item'), 'No Framed Item!')
  }))
  Hud.openScreen(sc)
}

/**
 * add an item with hover event and click event
 * @param {number} x 
 * @param {number} y 
 * @param {ItemStackHelper} item 
 * @param {string} textIfEmpty 
 */
function addItem(x, y, item, textIfEmpty = 'No Item!') {
  if (item instanceof NBTElementHelper) item = ItemStack.method_7915(item.getRaw()) // .fromNbt()
  if (item && !(item instanceof ItemStackHelper)) item = new ItemStackHelper(item)
  if (!item || item.isEmpty()) {
    sc.addItem(x, y, 'minecraft:barrier')
    const txt = Chat.createTextBuilder()
      .append('空空')
      .withShowTextHover(typeof textIfEmpty === 'string' ?
        Chat.createTextHelperFromString(textIfEmpty) : textIfEmpty
      )
      .build()
    sc.addText(txt, x - 2, y - 2, 0x05000000, false)
    sc.addText(txt, x - 2, y + 6, 0x05000000, false)
    return
  }
  sc.addItem(x, y, item)
  const txt = Chat.createTextBuilder()
    .append('空空')
    .withShowItemHover(item)
    .withCustomClickEvent(JavaWrapper.methodToJava(getItem(item)))
    .build()
  sc.addText(txt, x - 2, y - 2, 0x05000000, false)
  sc.addText(txt, x - 2, y + 6, 0x05000000, false)
}

/**
 * 
 * @param {ItemStackHelper} item 
 */
function getItem(item) {
  return () => {
    if (Player.getPlayer().getRaw().method_5687(2)) // .hasPermissionLevel
      Chat.say(`/give @s ${item.getItemId()}${toSnbt(item.getNBT())}`)
    else Chat.log(Chat.createTextHelperFromJSON(`{
      "text": "Don't have /give permission to get ",
      "extra": [${item.getName().getJson()}, {
        "text": "\nClick here to copy tags to clipboard.",
        "clickEvent": {
          "action": "copy_to_clipboard",
          "value": "${item.getItemId()}${toSnbt(item.getNBT()).replace(/"/g, '\\"')}"
        }
      }]
    }`))
  }
}

/**
 * 
 * @param {NBTElementHelper} nbt 
 */
function toSnbt(nbt) {
  if (nbt instanceof NBTElementHelper) nbt = nbt.toString()
  if (typeof nbt !== 'string') return ''
  nbt = nbt.match(/^[^\{]*(\{.*\})$/)?.[1] ?? ''
  return nbt.startsWith('{{') ? nbt.slice(1, -1) : nbt
}
