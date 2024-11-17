//@ts-check
// fixes accessing legacyrandomsource from multiple threads error
// might affect singleplayer world generation
JsMacros.assertEvent(event, 'Service')
module.exports = 0

let world = null

const LocalRandom = Java.type('net.minecraft.class_6575')
const randomF = Reflection.getDeclaredField(Java.type('net.minecraft.class_1937'), 'field_9229')
randomF.setAccessible(true)

function checkRandom(currentWorld = World.getRaw()) {
  if (world !== currentWorld) {
    world = currentWorld
    // the random seems like will get multi thread access when doing container operations, so replace it with a safer one
    if (world)
      randomF.set(world, new LocalRandom(BigInt(Math.floor(Math.random() * 0xFFFFFFFFFFFF))))
  }
}

const ConnectScreen = Java.type('net.minecraft.class_412')
const connectionF = ConnectScreen.class.getDeclaredField('field_2411')
connectionF.setAccessible(true)

const MinecraftClient = Java.type('net.minecraft.class_310')
const integratedServerConnectionF = MinecraftClient.class.getDeclaredField('field_1746')
integratedServerConnectionF.setAccessible(true)

const getWorldFromConnection = conn => {
  try {
    conn?.method_10744()?.method_2890() // .getPacketListener()?.getWorld?.()
  } catch {
    return null
  }
}
const getWorldTries = [
  () => Client.getMinecraft().method_1562()?.method_2890(), // .getNetworkHandler()?.getWorld()
  () => {
    const screen = Hud.getOpenScreen()
    if (screen instanceof ConnectScreen) {
      const conn = connectionF.get(screen)
      try {
        return getWorldFromConnection(conn)
      } catch (e) {
        GlobalVars.putObject('test:connection', conn)
        Chat.log(`connection stored to 'test:connection' global variable`)
        const custom = JsMacros.createCustomEvent('custom')
        custom.putObject('err', e)
        JsMacros.runScript('js', 'throw event.getObject("err")', null, custom, null)
        JsMacros.getProfile().logError(e)
      }
    }
  },
  () => getWorldFromConnection(integratedServerConnectionF.get(Client.getMinecraft()))
]

// would've been better if EventDimensionChange provides the raw world
function tryGetWorld() {
  let world
  getWorldTries.some(v => world = v())
  return world ?? World.getRaw()
}

JsMacros.getProfile().getRegistry().joinableEvents.add('DimensionChange')
JsMacros.on('DimensionChange', true, JavaWrapper.methodToJava(() => {
  checkRandom(tryGetWorld())
}))

JsMacros.on('ChunkLoad', JavaWrapper.methodToJava(() => checkRandom()))

checkRandom()
