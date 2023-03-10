
/**
 * to fill coords in the chat
 * keyword must be at the end
 * keywords:
 *  player block pos:
 *    only space: pos or $pos
 *    with comma: pos, or $pos,
 *  looking at block pos:
 *    only space: bpos or $bpos
 *    with comma: bpos, or $bpos,
 * 
 * is service
 */

const posReg = /\$?\bpos,? *$/
const bposReg = /\$?\bbpos,? *$/

const Arrays = Java.type('java.util.Arrays')
const StringRange = Java.type('com.mojang.brigadier.context.StringRange')
const Suggestion = Java.type('com.mojang.brigadier.suggestion.Suggestion')
const InputSuggestorF = Reflection.getDeclaredField(Java.type('net.minecraft.class_408'), 'field_21616')
InputSuggestorF.setAccessible(true)
const suggestorWindowF = Reflection.getDeclaredField(Java.type('net.minecraft.class_4717'), 'field_21612')
suggestorWindowF.setAccessible(true)
const SuggestionWindow = Reflection.getClass('net.minecraft.class_4717$class_464').getDeclaredConstructors()[0]
SuggestionWindow.setAccessible(true)
const chatFieldF = Reflection.getDeclaredField(Java.type('net.minecraft.class_408'), 'field_2382')
chatFieldF.setAccessible(true)
const changedListenerF = Reflection.getDeclaredField(Java.type('net.minecraft.class_342'), 'field_2088')
changedListenerF.setAccessible(true)

JsMacros.on('OpenScreen', JavaWrapper.methodToJava(e => {
  if (e.screenName !== 'Chat') return
  let block = Player.rayTraceBlock(8, false)
  new Promise((res, rej) => {
    e.screen.setOnKeyPressed(JavaWrapper.methodToJava(res))
    e.screen.setOnClose(JavaWrapper.methodToJava(rej))
  }).then(() => {
    if (Hud.getOpenScreenName() !== 'Chat') return
    const screen = Hud.getOpenScreen()
    const input = chatFieldF.get(screen)

    // i sure hope this message won't appear anymore COPIUM
    if (!input) return Chat.log(`[PosFiller err] null input in class ${Reflection.getClassName(screen)}`)
    const composed = changedListenerF.get(input)?.andThen(JavaWrapper.methodToJava(text => {
      if (posReg.test(text)) {
        const {x, y, z} = Player.getPlayer().getBlockPos()
        const index = text.search(posReg)
        suggest(screen, text.slice(0, index), index, text.length,
          text.trim().at(-1) === ',' ? `${x}, ${y}, ${z}` : `${x} ${y} ${z} `)
      }else if (bposReg.test(text)) {
        if (!block) block = Player.rayTraceBlock(8, false)
        const index = text.search(bposReg)
        if (block) suggest(screen, text.slice(0, index), index, text.length, text.trim().at(-1) === ',' ?
          `${block.getX()}, ${block.getY()}, ${block.getZ()}` :
          `${block.getX()} ${block.getY()} ${block.getZ()} `
        )
      }
    }))
    
    if (composed) input.method_1863(composed) // input.setChangedListener()
    else Chat.log('[PosFiller err] null composed')
  })
}))

function suggest(screen, pretext, start, end, suggest) {
  const getTextWidth = Client.getMinecraft().field_1772.method_1727
  const InputSuggestor = InputSuggestorF.get(screen)
  suggestorWindowF.set(InputSuggestor, SuggestionWindow.newInstance(
    InputSuggestor,
    getTextWidth(pretext) + 4, // x
    screen.getHeight() - 12, // y
    getTextWidth(suggest), // width
    Arrays.asList(new Suggestion(StringRange.between(start, end), suggest)),
    false // narrateFirstSuggestion
  ))
  InputSuggestor.method_23933(true) // .setWindowActive()
}
