//@ts-check
// show horse stat when you look at it
JsMacros.assertEvent(event, 'Service')
module.exports = 0

if (!World.isWorldLoaded())
  JsMacros.waitForEvent('ChunkLoad')

const d2d = Hud.createDraw2D()
const graphic = Hud.createDraw2D()

const elem = {
  background: graphic.addRect(0, 0, 160, 76, 0x333333),
  title:      graphic.addText('Name',  5, 5, 0xFFFFFF, false),
  speedIcon:  graphic.addImage(4, 16, 16, 16, 'textures/mob_effect/speed.png',        0, 0, 16, 16, 16, 16),
  jumpIcon:   graphic.addImage(4, 36, 16, 16, 'textures/mob_effect/jump_boost.png',   0, 0, 16, 16, 16, 16),
  healthIcon: graphic.addImage(4, 56, 16, 16, 'textures/mob_effect/health_boost.png', 0, 0, 16, 16, 16, 16),
  speedText:  graphic.addText('Speed: ',  24, 19, 0xFFFFFF, false),
  jumpText:   graphic.addText('Jump: ',   24, 39, 0xFFFFFF, false),
  healthText: graphic.addText('Health: ', 24, 59, 0xFFFFFF, false),
  speedBar:   graphic.addRect(24, 28, 156, 29, 0xFFFFFF),
  jumpBar:    graphic.addRect(24, 48, 156, 49, 0xFFFFFF),
  healthBar:  graphic.addRect(24, 68, 156, 69, 0xFFFFFF)
}

const rankGrading = [0,        40,       70,       80,       90,       95,      Infinity]
const rankColor   = [0x808080, 0xFFFFFF, 0x00FF00, 0xFF8000, 0xFF00FF, 0xE80000]
//                   gray      white     green     gold      purple    red
/** @type {EntityHelper?} */
let lastHorse = null
let keep = 0

d2d.setOnInit(JavaWrapper.methodToJavaAsync(2, () => {
  d2d.addDraw2D(graphic, Math.floor(d2d.getWidth() / 2) - 79, Math.floor(d2d.getHeight() / 2) + 20, 160, 76)
  if (graphic.getElements().isEmpty()) { // in case the element got cleared
    for (const e of Object.values(elem)) graphic.reAddElement(e)
  }
}))

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  const horse = Player.getInteractionManager()?.getTargetedEntity()
  if (lastHorse?.equals(horse)) return keep = 8
  if (!horse?.is('horse')) {
    if (lastHorse && keep-- <= 0) {
      d2d.unregister()
      lastHorse = null
    }
    return
  }
  const percentStat = {
    speed: toPercent(horse.getSpeedStat(), horse.getMinSpeedStat(), horse.getMaxSpeedStat()),
    jump: toPercent(horse.getJumpStrengthStat(), horse.getMinJumpStrengthStat(), horse.getMaxJumpStrengthStat()),
    health: toPercent(horse.getHealthStat(), horse.getMinHealthStat(), horse.getMaxHealthStat())
  }
  const rarity = { speed: 0, jump: 0, health: 0 }
  for (const n in rarity) {
    rarity[n] = Math.max(0, rankGrading.findIndex(r => +percentStat[n] < r) - 1)
    elem[`${n}Bar`].x2 = 24 + Math.floor(1.32 * +percentStat[n])
    elem[`${n}Bar`].color = rankColor[rarity[n]] | 0xFF000000
    elem[`${n}Text`].color = rankColor[rarity[n]]
  }
  elem.background.color =
    (rankColor[Math.floor(((rarity.speed ** 4 + rarity.jump ** 4 + rarity.health ** 4) / 3) ** 0.25)] >>> 2 & 0x3F3F3F) | 0xCF000000
  elem.title.setText(horse.getName())
  elem.speedText.setText(`Speed: ${(horse.getHorseSpeed() - 0.001).toFixed(3)} m/s (${percentStat.speed}%)`)
  elem.jumpText.setText(`Jump: ${horse.getHorseJumpHeight().toFixed(2)} blocks (${percentStat.jump}%)`)
  elem.healthText.setText(`Health: ${horse.getHealthStat().toFixed(1)} (${percentStat.health}%)`)
  if (!lastHorse)
    d2d.register()
  lastHorse = horse
  keep = 8
}))

event.unregisterOnStop(true, d2d)

/**
 * @param {number} value  
 * @param {number} min  
 * @param {number} max  
 */
function toPercent(value, min, max, fixed = 1) {
  return ((value - min) / (max - min) * 100).toFixed(fixed)
}
