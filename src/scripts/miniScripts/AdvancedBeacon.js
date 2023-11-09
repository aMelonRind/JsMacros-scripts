//@ts-check
JsMacros.assertEvent(event, 'Service')
module.exports = 0

const primaryOffset = 0
const secondaryOffset = 0

const BeaconScreen = Java.type('net.minecraft.class_466')
const StatusEffects = Java.type('net.minecraft.class_1294')
const effects = [
  ['c❌', 'Clear', ''],
  ['a👢', 'Speed', 'field_5904'],
  ['6⛏', 'Haste', 'field_5917'],
  ['7🛡', 'Resistance', 'field_5907'],
  ['b⏫', 'Jump Boost', 'field_5913'],
  ['4🗡', 'Strength', 'field_5910'],
  ['c❤', 'Regeneration', 'field_5924']
].map(e => ['§' + e[0], Chat.createTextHelperFromString(e[1]), e[2] ? StatusEffects[e[2]] : null])

const os = JsMacros.on('OpenScreen', JavaWrapper.methodToJava(e => {
  if (!(e.screen instanceof BeaconScreen)) return
  let t = 10
  while (e.screen.getWidth() === 0 && t-- > 0) Client.waitTick()
  addWidgets(e.screen, primaryOffset - 11, 'jsmacros_setPrimaryEffect')
  addWidgets(e.screen, secondaryOffset + 8, 'jsmacros_setSecondaryEffect')
}))

/**
 * @param {IScreen} screen 
 * @param {number} offset 
 * @param {string} method 
 */
function addWidgets(screen, offset, method) {
  const x = Math.floor(screen.getWidth() / 2) + offset
  const sy = Math.floor(screen.getHeight() / 2) - 84
  effects.forEach((e, i) => {
    const y = sy + i * 10
    screen.addText(
      Chat.createTextBuilder().append(e[0]).withShowTextHover(e[1])
        .withCustomClickEvent(JavaWrapper.methodToJava(() => screen[method](e[2])))
        .build(),
      x, y, 0xFFFFFF, true
    )
  })
}

event.stopListener = JavaWrapper.methodToJava(() => JsMacros.off('OpenScreen', os))
