// @ts-nocheck
const NbtElementHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper')
const NbtCompound = Java.type('net.minecraft.class_2487')

const NbtList = Java.type('net.minecraft.class_2499')
const NbtListValueF = Reflection.getDeclaredField(NbtList, 'field_11550')
NbtListValueF.setAccessible(true)

const ItemStack = Java.type('net.minecraft.class_1799')
const ItemStackHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.inventory.ItemStackHelper')

/** @type {()} */ const fromNbt     = 'method_7915'
/** @type {()} */ const getString   = 'method_10558'
/** @type {()} */ const getCompound = 'method_10562'
/** @type {()} */ const put         = 'method_10566'
/** @type {()} */ const putByte     = 'method_10567'
/** @type {()} */ const getByte     = 'method_10571'
/** @type {()} */ const get         = 'method_10580'
/** @type {()} */ const putString   = 'method_10582'
/** @type {()} */ const copy        = 'method_10707'
/** @type {()} */ const isEmpty     = 'method_33133'

class NbtHelper {

  /**
   * @returns {NbtCompound}
   */
  static newNbtCompound() {
    return new NbtCompound()
  }

  /**
   * @param {NbtCompound} nbt 
   * @param {string} key 
   * @param {NbtElement} value 
   */
  static putElement(nbt, key, value) {
    return nbt[put](key, value)
  }

  /**
   * @param {NbtCompound} nbt 
   * @param {string} key 
   * @param {string} value 
   */
  static putString(nbt, key, value) {
    return nbt[putString](key, value)
  }

  /**
   * @param {NbtCompound} nbt 
   * @param {string} key 
   * @param {number} value 
   */
  static putByte(nbt, key, value) {
    return nbt[putByte](key, value)
  }

  /**
   * @param {NbtCompound} nbt 
   * @param {string} key 
   * @returns {NbtCompound}
   */
  static getCompound(nbt, key) {
    return nbt[getCompound](key)
  }

  /**
   * @param {NbtCompound} nbt 
   * @param {string} key 
   * @returns {NbtList}
   */
  static getList(nbt, key) {
    const list = nbt[get](key)
    return list instanceof NbtList ? list : null
  }

  /**
   * @param {NbtCompound} nbt 
   * @param {string} key 
   * @returns {string}
   */
  static getString(nbt, key) {
    return nbt[getString](key)
  }

  /**
   * @param {NbtCompound} nbt 
   * @param {string} key 
   * @returns {number}
   */
  static getByte(nbt, key) {
    return nbt[getByte](key)
  }

  /**
   * @param {NbtList} nbt 
   * @returns {JavaList<NbtElement>}
   */
  static getContainedList(nbt) {
    return NbtListValueF.get(nbt)
  }

  /**
   * @param {JavaList<NbtElement>} list 
   * @returns {NbtList}
   */
  static toNbtList(list) {
    const nbtList = new NbtList()
    NbtListValueF.set(nbtList, list)
    return nbtList
  }

  /**
   * @param {*} nbt 
   * @returns {nbt is NbtCompound}
   */
  static isCompound(nbt) {
    return nbt instanceof NbtCompound
  }

  /**
   * @param {JavaList<*>} list 
   * @return {list is JavaList<NbtCompound>}
   */
  static isListOfCompound(list) {
    return Java.from(list).every(e => this.isCompound(e))
  }

  /**
   * @param {NbtCompound} nbt 
   * @returns {boolean}
   */
  static isEmpty(nbt) {
    return nbt[isEmpty]()
  }

  /**
   * @template {NbtElement} T
   * @param {T} nbt 
   * @returns {T}
   */
  static copy(nbt) {
    return nbt[copy]()
  }

  /**
   * @template {NbtElement} T
   * @param {T} nbt 
   * @returns {T extends NbtCompound ? NBTElementHelper$NBTCompoundHelper : T extends NbtList ? NBTElementHelper$NBTListHelper : Packages.xyz.wagyourtail.jsmacros.client.api.helpers.NBTElementHelper<any>}
   */
  static toJsmHelper(nbt) {
    return NbtElementHelper.resolve(nbt)
  }

  /**
   * also sets Count to 1
   * @param {ItemStackHelper} item 
   */
  static getNbtFromItem(item) {
    const nbt = this.newNbtCompound()
    this.putString(nbt, 'id', item.getItemId())
    this.putByte(nbt, 'Count', 1)
    const tag = item.getNBT()
    if (tag) this.putElement(nbt, 'tag', this.copy(tag.getRaw()))
    return nbt
  }

  /**
   * @param {NbtCompound} nbt 
   * @returns {ItemStackHelper}
   */
  static getItemFromNbt(nbt) {
    return new ItemStackHelper(ItemStack[fromNbt](nbt))
  }

  /**
   * @param {NbtCompound} nbt 
   * @returns {boolean}
   */
  static isShulker(nbt) {
    return /^minecraft:(?:\w+_)?shulker_box$/.test(this.getString(nbt, 'id'))
  }

  /**
   * @param {NbtCompound} nbt 
   * @returns {JavaMap<ItemStackHelper, number>}
   */
  static unpackItems(nbt) {
    /** @type {JavaMap<NbtCompound, number>} */
    const items = JavaUtils.createHashMap()
    const itemsNbt = NbtElementHelper.resolve(nbt)?.asCompoundHelper()
      .get('tag')?.asCompoundHelper()
      .get('BlockEntityTag')?.asCompoundHelper()
      .get('Items')
    if (itemsNbt?.isList() && !NbtHelper.getContainedList(itemsNbt.getRaw()).isEmpty()) {
      for (const inbt of java.util.List.copyOf(NbtHelper.getContainedList(itemsNbt.getRaw()))) {
        try {
          const item = this.getItemFromNbt(inbt)
          const iinbt = this.getNbtFromItem(item)
          items.put(iinbt, items.getOrDefault(iinbt, 0) + item.getCount())
        } catch (e) {}
      }
    } else {
      try {
        const item = this.getItemFromNbt(nbt)
        items.put(this.getNbtFromItem(item), item.getCount())
      } catch (e) {}
    }
    if (items.isEmpty()) return items
    /** @type {JavaMap<ItemStackHelper, number>} */
    const convertedItems = JavaUtils.createHashMap()
    let count = this.getByte(nbt, 'Count')
    if (!(count > 1)) count = 1
    for (const nbt of items.keySet()) {
      try {
        const item = this.getItemFromNbt(nbt)
        if (item.isEmpty()) continue
        convertedItems.put(item, items.get(nbt) * count)
      } catch (e) {}
    }
    return convertedItems
  }

}

module.exports = NbtHelper
