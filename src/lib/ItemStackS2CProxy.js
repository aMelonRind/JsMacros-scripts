//@ts-check
// provides a proxy for handling received item stacks
// see L88 for an example

JsMacros.assertEvent(event, 'Service') // to prevent dummy that uses this module on other events

const ItemStackHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper')
const NbtList = Java.type('net.minecraft.class_2499')
const NbtString = Java.type('net.minecraft.class_2519')

const ref = {
  /**
   * override this callback
   * @param {*} item ItemStack
   * @returns {*}
   */
  check(item) {},
  /**
   * @param {*} item ItemStack
   */
  helper(item) {
    return new ItemStackHelper(item)
  },
  /**
   * @param {*} stack ItemStack
   * @param {*} item Item
   * @returns {boolean}
   */
  isOf(stack, item) {
    return stack.method_31574(item)
  },
  /**
   * @param {string} str 
   * @returns {*} NbtString
   */
  ofNbtStr(str) {
    return NbtString.method_23256(str)
  },
  /**
   * @param {*} item ItemStack
   * @returns {JavaList<*>} NbtList<NbtString>
   */
  getLore(item) {
    const display = item.method_7911('display') // .getOrCreateSubNbt()
    if (display.method_10573('Lore', 9)) // .contains()
      return display.method_10554('Lore', 8) // .getList()
    const list = new NbtList()
    display.method_10566('Lore', list) // .put()
    return list
  }
}

/** @type {(type: PacketName, cb: (packet: any) => any) => IEventListener} */
const reg = (type, cb) => JsMacros.on(
  'RecvPacket',
  JsMacros.createEventFilterer('RecvPacket').setType(type),
  // true, // optional
  JavaWrapper.methodToJava(e => {
    const p = e.packet
    if (p) cb(p)
  })
)

function check(item) {
  if (item.method_7960()) return // .isEmpty()
  ref.check(item)
}

reg('EntityEquipmentUpdateS2CPacket', p => {
  for (const pair of p.method_30145()) // .getEquipmentList()
    check(pair.getSecond())
})

reg('InventoryS2CPacket', p => {
  for (const item of p.method_11441()) // .getContents()
    check(item)
  check(p.method_37437()) // .getCursorStack()
})

reg('ScreenHandlerSlotUpdateS2CPacket', p => {
  check(p.method_11449()) // .getStack()
})

module.exports = ref


if (0) { // example for cultivation, a slimefun addon
  const PLAYER_HEAD = Java.type('net.minecraft.class_1802').field_8575
  const itemProxy = ref // aka require('./lib/ItemStackS2CProxy')

  itemProxy.check = item => {
    if (!itemProxy.isOf(item, PLAYER_HEAD)) return
    const nbt = itemProxy.helper(item).getNBT()
    if (!nbt) return
    const id = nbt.resolve('PublicBukkitValues.slimefun:slimefun_item')?.at(0)?.asString()
    if (!id?.startsWith('CLT_PLANT_')) return
    const lore = itemProxy.getLore(item)
    lore.add(0, itemProxy.ofNbtStr(`"§r§7${id.slice('CLT_PLANT_'.length)}"`))
    const inst = nbt.resolve('PublicBukkitValues.cultivation:seed_instance')?.at(0)
    if (!inst?.isCompound()) return
    const d = getNumber(inst, 'cultivation:drop_rate')
    const g = getNumber(inst, 'cultivation:growth_speed')
    const s = getNumber(inst, 'cultivation:strength')
    lore.add(1, itemProxy.ofNbtStr(`"§r§f ${d} / ${g} / ${s}"`))
  }

  /**
   * @param {NBTElementHelper$NBTCompoundHelper} obj 
   * @param {string} key 
   */
  function getNumber(obj, key) {
    const e = obj.get(key)
    if (!e?.isNumber()) return NaN
    return e.asInt()
  }
}
