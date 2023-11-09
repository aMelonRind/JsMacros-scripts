
// will widen the chat if focused
JsMacros.assertEvent(event, 'Service')
module.exports = 0

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
    if (!isOpen) was = Math.min(1, optionValue.get(widthOption))
    isOpen = true
    setWidth(was * multiplier)
  } else if (isOpen) {
    setWidth(was)
    isOpen = false
  }
}))

event.stopListener = JavaWrapper.methodToJava(() => {
  if (isOpen) setWidth(was)
})

/**
 * @param {number} value 
 */
function setWidth(value) {
  optionValue.set(widthOption, new Double(value))
  Chat.getHistory().refreshVisible()
}
