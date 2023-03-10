
// show horse stat when you look at it
// is service

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')
const d2d = Hud.createDraw2D()
const orig = {d2dsize: {}, bar: {sizeMultiply: 1.32}}
const Elem = {
  background: d2d.addRect(0, 0, 160, 76, 0x333333),
  title:      d2d.addText('Name',  5, 5, 0xFFFFFF, false),
  speedIcon:  d2d.addImage(4, 16, 16, 16, 'textures/mob_effect/speed.png',        0, 0, 16, 16, 16, 16),
  jumpIcon:   d2d.addImage(4, 36, 16, 16, 'textures/mob_effect/jump_boost.png',   0, 0, 16, 16, 16, 16),
  healthIcon: d2d.addImage(4, 56, 16, 16, 'textures/mob_effect/health_boost.png', 0, 0, 16, 16, 16, 16),
  speedText:  d2d.addText('Speed: ',  24, 19, 0xFFFFFF, false),
  jumpText:   d2d.addText('Jump: ',   24, 39, 0xFFFFFF, false),
  healthText: d2d.addText('Health: ', 24, 59, 0xFFFFFF, false),
  speedBar:   d2d.addRect(24, 28, 156, 29, 0xFFFFFF),
  jumpBar:    d2d.addRect(24, 48, 156, 49, 0xFFFFFF),
  healthBar:  d2d.addRect(24, 68, 156, 69, 0xFFFFFF)
}
const rankGrading = [0,        40,       70,       80,       90,       95].reverse()
const rankColor   = [0x808080, 0xFFFFFF, 0x00FF00, 0xFF8000, 0xFF00FF, 0xE80000]
//                   gray      white     green     gold      purple    red
let horseid = null, keep = 0

d2d.setOnInit(JavaWrapper.methodToJava(() => {
  if (orig.d2dsize.w !== d2d.getWidth() || orig.d2dsize.h !== d2d.getHeight()) { // size is 160x76
    orig.d2dsize.w = d2d.getWidth()
    orig.d2dsize.h = d2d.getHeight()
    orig.x = Elem.background.x1 = Math.floor(orig.d2dsize.w / 2) - 79
    orig.y = Elem.background.y1 = Math.floor(orig.d2dsize.h / 2) + 20
    orig.bar.orig = orig.x + 24
    Elem.background.x2 = orig.x + 160
    Elem.background.y2 = orig.y + 76
    Elem.title.x       = orig.x + 5
    Elem.title.y       = orig.y + 5
    Elem.speedIcon.x =  Elem.jumpIcon.x =  Elem.healthIcon.x = orig.x + 4
    Elem.speedText.x =  Elem.jumpText.x =  Elem.healthText.x =
    Elem.speedBar.x1 =  Elem.jumpBar.x1 =  Elem.healthBar.x1 = orig.x + 24
    Elem.speedBar.x2 =  Elem.jumpBar.x2 =  Elem.healthBar.x2 = orig.x + 155
    Elem.speedIcon.y = (Elem.jumpIcon.y = (Elem.healthIcon.y = orig.y + 56) - 20) - 20
    Elem.speedText.y = (Elem.jumpText.y = (Elem.healthText.y = orig.y + 59) - 20) - 20
    Elem.speedBar.y1 = (Elem.jumpBar.y1 = (Elem.healthBar.y1 = orig.y + 68) - 20) - 20
    Elem.speedBar.y2 = (Elem.jumpBar.y2 = (Elem.healthBar.y2 = orig.y + 69) - 20) - 20
  }
  Object.values(Elem).forEach(e => {d2d.reAddElement(e)})
}))

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  const horse = Player.rayTraceEntity()
  if (horseid && (horse?.getUUID() === horseid)) return keep = 8
  if (horse?.getType() !== 'minecraft:horse')
    if (!horseid || keep-- > 0) return
    else {
      d2d.unregister()
      horseid = null
      return
    }
  const rawAttr = {}
  const att = horse.getNBT().get('Attributes')
  for (let a = 0; a < att.length(); a++) 
    rawAttr[att.get(a).get('Name').asString()] = att.get(a).get('Base').asDouble()
  if (!rawAttr['minecraft:generic.movement_speed']
  ||  !rawAttr['minecraft:horse.jump_strength']
  ||  !rawAttr['minecraft:generic.max_health'])
    return keep = 8
  const recognizableStat = { // convert attributes to recognizable format
    speed: (42.16 * rawAttr['minecraft:generic.movement_speed'] - 0.001).toFixed(3),
    jump: (-0.1817584952 * (rawAttr['minecraft:horse.jump_strength'] ** 3) + // wiki function
            3.689713992  * (rawAttr['minecraft:horse.jump_strength'] ** 2) +
            2.128599134  *  rawAttr['minecraft:horse.jump_strength'] - 0.343930367).toFixed(2),
    health: rawAttr['minecraft:generic.max_health'].toFixed(1)
  }
  const percentStat = {
    speed:  ((rawAttr['minecraft:generic.movement_speed'] - 0.1125) / 0.225 * 100).toFixed(1),
    jump:   ((rawAttr['minecraft:horse.jump_strength']    - 0.4   ) / 0.6   * 100).toFixed(1),
    health: ((rawAttr['minecraft:generic.max_health']     - 15    ) / 15    * 100).toFixed(1)
  }
  const rarity = {};
  ['speed', 'jump', 'health'].forEach(n => { // sort rarity
    rankGrading.some((r, i) => percentStat[n] >= r ? ((rarity[n] = 5 - i), true) : false)
    if (!rarity[n]) rarity[n] = 0
  })
  Elem.background.color =
  (rankColor[Math.floor(((rarity.speed ** 4 + rarity.jump ** 4 + rarity.health ** 4) / 3) ** 0.25)] >>> 2 & 0x3F3F3F) | 0xCF000000
  Elem.title.setText(horse.getName())
  Elem.speedText .setText(`Speed: ${recognizableStat.speed} m/s (${percentStat.speed}%)`)
  Elem.jumpText  .setText(`Jump: ${recognizableStat.jump} blocks (${percentStat.jump}%)`)
  Elem.healthText.setText(`Health: ${recognizableStat.health} (${percentStat.health}%)`)
  if (!horseid) d2d.register();
  ['speed', 'jump', 'health'].forEach(n => {
    Elem[`${n}Bar` ].x2 = orig.bar.orig + Math.floor(orig.bar.sizeMultiply * percentStat[n])
    Elem[`${n}Bar` ].color = rankColor[rarity[n]] | 0xFF000000
    Elem[`${n}Text`].color = rankColor[rarity[n]]
  })
  horseid = horse.getUUID()
  keep = 8
}))

event.stopListener = JavaWrapper.methodToJava(() => {
  if (horseid) d2d.unregister()
})
