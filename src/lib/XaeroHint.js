//@ts-check

/**
 * @param {string} ip 
 * @param {(dim: Dimension, world: any) => int?} detector 
 * @return {IEventListener?}
 */
function registerXaeroHint(ip, detector) {
  /** @type {*} */
  let WorldMapSession
  try {
    WorldMapSession = Java.type('xaero.map.WorldMapSession')
  } catch {
    return null
  }
  const logger = require('./Logger')
  ip += '/'
  /** @type {MethodWrapper<{ readonly dimension: Dimension }, any>} */
  const callback = JavaWrapper.methodToJavaAsync(({ dimension }, world) => {
    Client.waitTick() // wait a tick because this event didn't provide any shit and is injected too early
    if (!World.getCurrentServerAddress()?.startsWith(ip)) return
    world ??= World.getRaw()
    if (!world || World.getDimension() !== dimension) return
    const result = detector(dimension, world)
    if (World.getRaw() !== world) return
    if (result == null) {
      logger.log(`Registered Xaero Hint cannot determine this world. (${World.getDimension()})`)
      return
    }

    if (isNaN(result)) {
      // const processor = WorldMapSession.getCurrentSession()?.getMapProcessor()
      // if (processor) {
      //   // if we found a way to make xaero not to save the map...
      // }
      return
    }

    Client.runOnMainThread(JavaWrapper.methodToJava(() => {
      WorldMapSession.getCurrentSession()?.getMapProcessor()?.onServerLevelId(result)
      // logger.log(`dimension id set to ${result}`)
    }))
  })
  const dimension = World.getDimension()
  const world = World.getRaw()
  if (dimension && world) {
    callback.apply({ dimension }, world)
  }
  return JsMacros.on('DimensionChange', callback)
}

module.exports = { registerXaeroHint }
