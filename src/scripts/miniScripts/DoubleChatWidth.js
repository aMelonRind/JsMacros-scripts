
// will widen the chat if focused
// is service

const multiplier = 2.0

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

const Double = Java.type('java.lang.Double')

const optionValue = Java.type('net.minecraft.class_7172').class.getDeclaredField('field_37868')
optionValue.setAccessible(true)

const widthOption = Client.getGameOptions().getRaw().method_42556() // .getChatWidth()

let isOpen = false
let was = 1.0

JsMacros.on('OpenScreen', JavaWrapper.methodToJava(e => {
  if (e.screenName === 'Chat') {
    if (!isOpen) was = optionValue.get(widthOption)
    optionValue.set(widthOption, new Double(was * multiplier))
    isOpen = true
  } else if (isOpen) {
    optionValue.set(widthOption, new Double(was))
    isOpen = false
  }
}))

event.stopListener = JavaWrapper.methodToJava(() => {
  if (isOpen) optionValue.set(widthOption, new Double(was))
})

module.exports = {}
