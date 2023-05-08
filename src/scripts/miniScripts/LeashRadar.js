
// able to know the locations and distance of leashed mobs
// is service

const warnOrange     = 8    ** 2
const warnRed        = 10   ** 2
const zoom           = 5.0
const updateInterval = 10

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')
const MobEntity = Java.type('net.minecraft.class_1308')
const D2R = Math.PI / 180
const d2d = Hud.createDraw2D()
const orig = {w: 0, h: 0, x: 0, y: 0}
let praw = Player.getPlayer().getRaw()
/** @type {LeashedMob[]} */
let mobs = []
let timer = 100
let rendering = false
const dist = d2d.addText('0.0', 0, 0, 0xFFFFFF, true)
const count = d2d.addText('0', 0, 0, 0xFFFFFF, true)

d2d.setOnInit(JavaWrapper.methodToJava(() => {
  if (orig.w !== d2d.getWidth() || orig.h !== d2d.getHeight()) {
    orig.w = d2d.getWidth()
    orig.h = d2d.getHeight()
    orig.x = Math.floor(orig.w / 2)
    orig.y = Math.floor(orig.h / 2)
    dist.setPos(orig.x - 5, orig.y + Math.floor(zoom * 10))
    count.setPos(orig.x - 5, orig.y + Math.floor(zoom * 10) + 10)
  }
  d2d.reAddElement(dist)
  d2d.reAddElement(count)
  mobs.forEach(m => d2d.reAddElement(m.dot))
}))

JsMacros.on('Tick', JavaWrapper.methodToJava(() => {
  if (!World.isWorldLoaded()) return
  praw = Player.getPlayer().getRaw()

  if (++timer >= updateInterval) {
    timer = 0
    Java.from(World.getEntities()).forEach(e => {
      if (e.getRaw() instanceof MobEntity && e.getRaw().method_5934() && e.getRaw().method_5933() === praw // .isLeashed() .getHoldingEntity()
       && mobs.every(m => !m.entity.getRaw().equals(e.getRaw()))) mobs.push(new LeashedMob(e))
    })
  }

  mobs = mobs.filter(m => m.check())
  if (mobs.length === 0) {
    d2d.unregister()
    rendering = false
    return
  }
  count.setText(`${mobs.length}`.padStart(2, ' '))
  const furthest = mobs.reduce((a, b) => a.dist > b.dist ? a : b)
  dist.setText(Math.sqrt(furthest.dist).toFixed(1))
  dist.color = furthest.color
}))

event.stopListener = JavaWrapper.methodToJava(() => {
  d2d.unregister()
})

class LeashedMob {
  /** @param {EntityHelper} e */
  constructor (e) {
    /** @type {EntityHelper} */
    this.entity = e
    if (!rendering) {
      d2d.register()
      rendering = true
    }
    this.dot = d2d.addRect(0, 0, 2, 2, 0xFFFFFF)
  }

  check () {
    if (!this.entity.isAlive() || this.entity.getRaw().method_5933() !== praw) {
      d2d.removeElement(this.dot)
      return false
    }
    this.dist = praw.method_5707(this.entity.getRaw().method_19538()) // .squaredDistanceTo(Vec) .getPos()
    const rad = (this.entity.getPos().toVector(Player.getPlayer().getPos()).getYaw() - Player.getPlayer().getYaw() - 90) * D2R
    const distXZ = Math.sqrt((Player.getPlayer().getX() - this.entity.getX()) ** 2 + (Player.getPlayer().getZ() - this.entity.getZ()) ** 2)
    const dotX = Math.floor(orig.x + distXZ * Math.cos(rad) * zoom)
    const dotY = Math.floor(orig.y + distXZ * Math.sin(rad) * zoom)
    this.dot.setPos(dotX, dotY, dotX + 2, dotY + 2)
    this.color = this.dist <= warnRed ? (this.dist <= warnOrange ? 0xFFFFFF : 0xFF7F00) : 0xFF0000
    this.dot.setColor(this.color)
    return true
  }
}

module.exports = {}
