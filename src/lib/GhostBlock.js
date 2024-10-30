
const reg = Client.getRegistryManager()

/**
 * @param {BlockPosHelper} pos 
 * @param {BlockStateHelper | CanOmitNamespace<BlockId>} state 
 */
function setGhost(pos, state) {
  if (typeof state === 'string') state = reg.getBlockState(state)
  return setGhostRaw(pos.getRaw(), state.getRaw())
}

/**
 * @param {BlockPosHelper} pos 
 * @param {{}} state BlockState
 */
function setGhostRawState(pos, state) {
  return setGhostRaw(pos.getRaw(), state)
}

/**
 * @param {{}} pos BlockPos
 * @param {{}} state BlockState
 */
function setGhostRaw(pos, state) {
  if (World.isWorldLoaded()) {
    Client.runOnMainThread(JavaWrapper.methodToJava(() => setGhostRawOnThread(pos, state)))
  }
}

/**
 * @param {{}} pos BlockPos
 * @param {{}} state BlockState
 */
function setGhostRawOnThread(pos, state) {
  const world = World.getRaw()
  if (!world?.method_22340(pos) || !world.method_24794(pos)) return false // .isPosLoaded() .isInBuildLimit()
  return world.method_8652(pos, state, 18) // .setBlockState
}

module.exports = {
  reg,
  setGhost,
  setGhostRawState,
  setGhostRaw,
  setGhostRawOnThread
}
