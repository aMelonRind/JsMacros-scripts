
// util.world

const util = require('../util')

const Float = Java.type('java.lang.Float')

const MainHand = Java.type('net.minecraft.class_1268').field_5808
const DirectionUp = Java.type('net.minecraft.class_2350').field_11036
const OperatorBlock = Java.type('net.minecraft.class_5552')
const PlayerActionC2SPacket = Java.type('net.minecraft.class_2846')
const PlayerActionC2SPacket$Action = Java.type('net.minecraft.class_2846$class_2847')
/** @type {JavaClass & NoConstructor} class color please */
const InteractionManager = Java.type('net.minecraft.class_636').class
const interactionManager = Client.getMinecraft().field_1761

class WorldHandler {

  breakingBlock = false

  getRaw() {
    return Client.getMinecraft().field_1687 // .world
  }

  /**
   * @param {Pos3D} pos 
   * @returns {Promise<boolean>} true if success
   */
  async breakBlock(pos) {
    if (this.breakingBlock) return false
    this.breakingBlock = true
    const res = await _breakBlock(pos)
    this.breakingBlock = false
    return res
  }

}

const blockBreakingSoundCooldownF = util.getField(InteractionManager, 'field_3713')
const currentBreakingPosF         = util.getField(InteractionManager, 'field_3714')
const currentBreakingProgressF    = util.getField(InteractionManager, 'field_3715')
const blockBreakingCooldownF      = util.getField(InteractionManager, 'field_3716')
const breakingBlockF              = util.getField(InteractionManager, 'field_3717')
const selectedStackF              = util.getField(InteractionManager, 'field_3718')
const gameModeF                   = util.getField(InteractionManager, 'field_3719')

const pendingUpdateManagerF = util.getField(Java.type('net.minecraft.class_638'), 'field_37951')

const isCurrentlyBreakingM = util.setAccessible(InteractionManager.getDeclaredMethod('method_2922',
  Java.type('net.minecraft.class_2338'))
)
const syncSelectedSlotM = util.setAccessible(InteractionManager.getDeclaredMethod('method_2911'))

/**
 * @param {Pos3D} pos 
 * @returns {Promise<boolean>} true if success
 */
async function _breakBlock(pos) {
  const p = Player.getPlayer()
  if (!util.canReachBlock(pos, p)) return false

  const bpos = pos.toRawBlockPos()
  /** @type {0 | 1 | 2} 0: breaking, 1: fail, 2: success */
  let res = 0
  while (!(res = updateBlockBreakingProgressMimic(interactionManager, bpos, DirectionUp))) {
    await util.waitTick()

    if (!util.canReachBlock(pos, p)) {
      interactionManager.method_2925() // .cancelBlockBreaking()
      break
    }
  }
  await util.waitTick()
  return res === 2
}

/**
 * slightly modified mimic of updateBlockBreakingProgress that removed unwanted calls
 * because we don't want crash due to called on wrong thread
 * @param {typeof interactionManager} self InteractionManager
 * @param {*} pos BlockPos
 * @param {*} direction Direction
 * @returns {0 | 1 | 2} 0: breaking, 1: fail, 2: success
 */
function updateBlockBreakingProgressMimic(self, pos, direction) {
  syncSelectedSlotM.invoke(self)
  const world = worldHandler.getRaw()
  const blockState = world.method_8320(pos) // .getBlockState(pos)
  if (blockState.method_26215() // .isAir()
  ||  blockState.method_26218(world, pos).method_1110() // .getOutlineShape(world, pos).isEmpty()
  ) {
    breakingBlockF.setBoolean(self, false)
    return 2
  }
  const rawp = Player.getPlayer().getRaw()
  rawp.method_6104(MainHand) // .swingHand(hand)
  const cd = blockBreakingCooldownF.getInt(self)
  if (cd > 0) {
    blockBreakingCooldownF.setInt(self, cd - 1)
    return 0
  }
  if (gameModeF.get(self).method_8386() // .isCreative()
  &&  world.method_8621().method_11951(pos) // .getWorldBorder().contains(pos)
  ) {
    blockBreakingCooldownF.setInt(self, 5)
    sendSequencedPacket(world, s => {
      breakBlockMimic(self, pos)
      return new PlayerActionC2SPacket(
        PlayerActionC2SPacket$Action.field_12968, // START_DESTROY_BLOCK
        pos, direction, s
      )
    })
    rawp.method_7350() // .resetLastAttackedTicks()
    return 2
  }
  if (isCurrentlyBreakingM.invoke(self, pos)) {
    const progress = currentBreakingProgressF.get(self)
      + blockState.method_26165(rawp, world, pos)
    currentBreakingProgressF.setFloat(self, new Float(progress))
    if (progress >= 1) {
      breakingBlockF.setBoolean(self, false)
      sendSequencedPacket(world, s => {
        breakBlockMimic(self, pos)
        return new PlayerActionC2SPacket(
          PlayerActionC2SPacket$Action.field_12973, // STOP_DESTROY_BLOCK
          pos, direction, s
        )
      })
      currentBreakingProgressF.setFloat(self, 0)
      blockBreakingCooldownF.setInt(self, 5)
    }
  } else {
    const instant = blockState.method_26165(rawp, world, pos) >= 1
    const ret = attackBlockMimic(self, pos, direction) ? (instant ? 2 : 0) : 1
    rawp.method_6104(MainHand) // .swingHand(hand)
    if (ret === 2) rawp.method_7350() // .resetLastAttackedTicks()
    return ret
  }
  world.method_8517( // .setBlockBreakingInfo(entityId, pos, progress)
    rawp.method_5628(), // .getId()
    currentBreakingPosF.get(self),
    Math.floor(currentBreakingProgressF.get(self) * 10) - 1
  )
  return 0
}

/**
 * @param {typeof interactionManager} self 
 * @param {*} pos BlockPos
 * @param {*} direction Direction
 * @returns 
 */
function attackBlockMimic(self, pos, direction) {
  const rawp = Player.getPlayer().getRaw()
  const world = worldHandler.getRaw()
  if (rawp.method_21701(world, pos, gameModeF.get(self))) return false
  if (!world.method_8621().method_11952(pos)) return false
  if (gameModeF.get(self).method_8386()) {
    sendSequencedPacket(world, s => {
      breakBlockMimic(self, pos)
      return new PlayerActionC2SPacket(
        PlayerActionC2SPacket$Action.field_12968, // START_DESTROY_BLOCK
        pos, direction, s
      )
    })
    blockBreakingCooldownF.setInt(self, 5)
  } else if (!breakingBlockF.get(self) || !isCurrentlyBreakingM.invoke(self, pos)) {
    if (breakingBlockF.get(self)) {
      util.sendPacket(new PlayerActionC2SPacket(
        PlayerActionC2SPacket$Action.field_12971, // ABORT_DESTROY_BLOCK
        currentBreakingPosF.get(self), direction
      ))
    }
    const blockState = world.method_8320(pos)
    sendSequencedPacket(world, s => {
      const bl = !blockState.method_26215()
      if (bl && currentBreakingProgressF.get(self) === 0) {
        blockState.method_26179(world, pos, rawp);
      }
      if (bl && blockState.method_26165(rawp, world, pos) >= 1) {
        breakBlockMimic(self, pos)
      } else {
        breakingBlockF.setBoolean(self, true)
        currentBreakingPosF.set(self, pos)
        selectedStackF.set(self, rawp.method_6047())
        currentBreakingProgressF.setFloat(self, 0)
        blockBreakingSoundCooldownF.setFloat(self, 0)
        world.method_8517( // .setBlockBreakingInfo(entityId, pos, progress)
          rawp.method_5628(), // .getId()
          currentBreakingPosF.get(self),
          Math.floor(currentBreakingProgressF.get(self) * 10) - 1
        )
      }
      return new PlayerActionC2SPacket(
        PlayerActionC2SPacket$Action.field_12968, // START_DESTROY_BLOCK
        pos, direction, s
      )
    })
  }
  return true;
}

/**
 * @param {typeof interactionManager} self 
 * @param {*} pos BlockPos
 * @returns 
 */
function breakBlockMimic(self, pos) {
  const rawp = Player.getPlayer().getRaw()
  const world = worldHandler.getRaw()
  if (rawp.method_21701(world, pos, gameModeF.get(self))) return false
  const blockState = world.method_8320(pos)
  if (!rawp.method_6047().method_7909().method_7885(blockState, world, pos, rawp)) return false
  const block = blockState.method_26204()
  if (block instanceof OperatorBlock && !rawp.method_7338()) return false
  if (blockState.method_26215()) return false
  block.method_9576(world, pos, blockState, rawp)
  const fluidState = world.method_8316(pos)
  const ret = world.method_8652(pos, fluidState.method_15759(), 11)
  if (ret) block.method_9585(world, pos, blockState)
  return ret
}

/**
 * @param {*} world ClientWorld
 * @param {(sequence: int) => any} packetCreator 
 */
function sendSequencedPacket(world = worldHandler.getRaw(), packetCreator) {
  try {
    util.sendPacket(packetCreator(pendingUpdateManagerF.get(world).method_41937().method_41942()))
    // world.getPendingUpdateManager().incrementSequence().getSequence()
  } catch (e) {
    util.log(`ignored an error in sendSequencedPacket function in util.world`)
  }
}

const worldHandler = new WorldHandler

module.exports = worldHandler
