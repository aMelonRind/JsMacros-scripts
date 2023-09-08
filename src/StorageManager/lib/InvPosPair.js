// @ts-check

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

/** @type {Set<BlockId>} */
const containerBlockIds = new Set([ 'minecraft:chest', 'minecraft:trapped_chest', 'minecraft:barrel' ])
const otherHalfMap = Object.freeze({
  northright: 'west',
  northleft:  'east',
  southright: 'east',
  southleft:  'west',
  westright:  'south',
  westleft:   'north',
  eastright:  'north',
  eastleft:   'south'
})

const Inventory = Java.type('xyz.wagyourtail.jsmacros.client.api.classes.inventory.Inventory')
const GenericContainerScreen = Java.type('net.minecraft.class_476')

class InvPosPair {

  /**
   * @type {InvPosPairCallback[]}
   * @readonly
   * @private
   */
  static listeners = []

  /**
   * @type {Click[]}
   * @private
   */
  static interacts = []

  /**
   * @param {BlockDataHelper} block
   */
  static onInteractContainer(block) {
    const click = new Click(block)
    if (click.isValid()) this.interacts.push(click)
  }

  static onOpenScreen() {
    const screen = Hud.getOpenScreen()
    if (!(screen instanceof GenericContainerScreen)) return
    const inv = Inventory.create(screen)
    const slots = inv.getMap().container?.length
    if (slots !== 27 && slots !== 54) return
    const double = slots === 54
    const time = Time.time() - 1500
    const index = this.interacts.findIndex(c => c.time > time)
    if (index === -1) return this.onPairFail(inv)
    this.interacts = this.interacts.slice(index).filter(c => c.isDouble() === double)
    if (this.interacts.length !== 1) return this.onPairFail(inv)
    this.listeners.forEach(cb => cb(
      inv,
      this.interacts[0].block?.getBlockPos() ?? null,
      this.interacts[0].block2?.getBlockPos() ?? null
    ))
    this.interacts = []
  }

  /**
   * @param {Inventory} inv 
   * @private
   */
  static onPairFail(inv) {
    this.listeners.forEach(cb => cb(inv, null, null))
  }

  /**
   * pos = `null` if it failed to pair inv and pos  
   * pos2 for double containers
   * @param {InvPosPairCallback} cb 
   */
  static on(cb) {
    return this.listeners.push(cb)
  }

  /**
   * @param {InvPosPairCallback} cb 
   */
  static off(cb) {
    const index = this.listeners.indexOf(cb)
    if (index === -1) return
    this.listeners.splice(index, 1)
  }

}

class Click {

  /** @readonly */
  time
  /** @type {BlockDataHelper?} */
  block = null
  /** @type {BlockDataHelper?} */
  block2 = null

  /**
   * @param {BlockDataHelper?} block
   */
  constructor (block) {
    this.time = Time.time()
    if (!block || !containerBlockIds.has(block?.getId())) return
    this.block = block
    if (block.getId() === 'minecraft:chest' || block.getId() === 'minecraft:trapped_chest') {
      const state = block.getBlockState()
      if (state.type !== 'single') {
        const block2 = World.getBlock(block.getBlockPos()[otherHalfMap[state.facing + state.type]]())
        if (block2?.getId() === block.getId()) {
          const state2 = block2.getBlockState()
          if (state.facing === state2.facing && (state.type === 'left' ? 'right' : 'left') === state2.type) {
            this.block2 = block2
          }
        }
      }
    }
  }

  isValid() { return !!this.block }

  isDouble() { return !!this.block2 }

}

JsMacros.on('InteractBlock', JavaWrapper.methodToJava(e => {
  if (containerBlockIds.has(e.block.getId())) InvPosPair.onInteractContainer(e.block)
}))

JsMacros.on('OpenScreen', JavaWrapper.methodToJavaAsync(() => { // OpenContainer currently doesn't work in 1.9.0 beta
  Client.waitTick()
  InvPosPair.onOpenScreen()
}))

module.exports = InvPosPair

/**
 * @callback InvPosPairCallback
 * @param {Inventory} inv 
 * @param {BlockPos?} pos 
 * @param {BlockPos?} pos2 
 * @returns {void}
 */
