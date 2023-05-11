
// util.world

const util = require('../util')

const MainHand = Java.type('net.minecraft.class_1268').field_5808
const DirectionUp = Java.type('net.minecraft.class_2350').field_11036
/** @type {JavaClass & NoConstructor} class color please */
const InteractionManager = Java.type('net.minecraft.class_636').class
const interactionManager = Client.getMinecraft().field_1761
const currentBreakingProgressF = util.getField(InteractionManager, 'field_3715')

class WorldHandler {

  breakingBlock = false

  getRaw() {
    return Client.getMinecraft().field_1687 // .world
  }

  /**
   * might throw `Accessing LegacyRandomSource from multiple threads` error
   * might crash client
   * @param {Pos3D} pos 
   * @returns {Promise<void>} 
   */
  async breakBlock(pos) {
    if (this.breakingBlock) return
    this.breakingBlock = true

    const bpos = pos.toRawBlockPos()
    const rawp = Player.getPlayer().getRaw()
    try {
      interactionManager.method_2910(bpos, DirectionUp)
      // .attackBlock(pos, direction)
      interactionManager.method_2902(bpos, DirectionUp)
      // .updateBlockBreakingProgress(pos, direction)
    } catch (e) {
      Chat.actionbar('blocked an error from util.world.breakBlock()')
    }
    rawp.method_23667(MainHand, true) // .swingHand(hand, fromServerPlayer)
    while (currentBreakingProgressF.get(interactionManager) !== 0) {
      // util.log(currentBreakingPosF.get(interactionManager) + " " + currentBreakingProgressF.get(interactionManager))
      await util.waitTick()
      try {
        interactionManager.method_2902(bpos, DirectionUp)
        // .updateBlockBreakingProgress
      } catch (e) {
        Chat.actionbar('blocked an error from util.world.breakBlock()')
      }
      rawp.method_23667(MainHand, true) // .swingHand(hand, fromServerPlayer)
    }

    this.breakingBlock = false
  }

}

module.exports = new WorldHandler
