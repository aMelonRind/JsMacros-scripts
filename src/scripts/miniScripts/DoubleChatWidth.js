//@ts-check
// will widen the chat if focused
JsMacros.assertEvent(event, 'Service')
module.exports = 0

const multiplier = 2.0

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

const chatOption = Client.getGameOptions().getChatOptions()

let isOpen = false
let was = 1.0

JsMacros.on('OpenScreen', JavaWrapper.methodToJavaAsync(e => {
  if (e.screenName === 'Chat') {
    if (!isOpen) was = Math.min(1, chatOption.getChatWidth())
    isOpen = true
    setWidth(was * multiplier)
  } else if (isOpen) {
    isOpen = false
    setWidth()
  }
}))

event.stopListener = JavaWrapper.methodToJava(() => isOpen && setWidth())

function setWidth(value = was) {
  chatOption.setChatWidth(value)
  Chat.getHistory().refreshVisible()
}
