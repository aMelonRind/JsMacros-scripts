//@ts-check

/**
 * @param {string} ip 
 * @param {() => int?} detector 
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
  const callback = JavaWrapper.methodToJavaAsync(() => {
    Client.waitTick() // wait a tick because this event didn't provide any shit and is injected too early
    if (!World.getCurrentServerAddress()?.startsWith(ip)) return
    const result = detector()
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
      logger.log(`dimension id set to ${result}`)
    }))
  })
  if (World.isWorldLoaded()) {
    callback.run()
  }
  return JsMacros.on('DimensionChange', callback)
}

module.exports = { registerXaeroHint }
