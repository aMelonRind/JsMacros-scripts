// @ts-check
// works like ghost hand and angel block
JsMacros.assertEvent(event, 'Service')
module.exports = 0
/** @type {Key} the key for toggle and config */
const key = 'key.keyboard.left.alt'

if (!World.isWorldLoaded()) JsMacros.waitForEvent('ChunkLoad')

const d3d = Hud.createDraw3D()
const box = d3d.addBox(0, 0, 0, 0, 0, 0, 0x00FFFF, 0x000000, false)
let pos = PositionCommon.createBlockPos(0, -999, 0)
let im = Player.getInteractionManager()
/** @type {IEventListener?} */
let scrollListener = null
let state = false
let pressed = false
let configuring = false
let distance = im.getReach()

const prefix = Chat.createTextBuilder()
  .append('[').withColor(0x6)
  .append('FixedReach').withColor(0xd)
  .append(']').withColor(0x6).append(' ').withColor(0xF).build()

/** @type {MethodWrapper<Events.MouseScroll, EventContainer>} */
const scrollCallback = JavaWrapper.methodToJava(e => {
  if (!state || !pressed || e.deltaY === 0) return
  e.cancel()
  configuring = true
  const decreasing = e.deltaY < 0
  if (distance === (decreasing ? 0 : im.getReach())) return
  const p = Player.getPlayer()
  const look = PositionCommon.createLookingVector(p).normalize().getEnd()
  const pos = look.scale(distance).add(p.getEyePos())
  let sub = pos.sub(pos.toBlockPos().toPos3D())
  const vec = decreasing ? look.scale(-1) : look
  if (vec.x > 0) sub.x = 1 - sub.x; else vec.x = -vec.x
  if (vec.y > 0) sub.y = 1 - sub.y; else vec.y = -vec.y
  if (vec.z > 0) sub.z = 1 - sub.z; else vec.z = -vec.z
  let dd = Math.min(sub.x / vec.x, sub.y / vec.y, sub.z / vec.z)
  sub = sub.sub(vec.scale(dd))
  if (sub.x < 0.0001) sub.x++
  if (sub.y < 0.0001) sub.y++
  if (sub.z < 0.0001) sub.z++
  dd += Math.min(sub.x / vec.x, sub.y / vec.y, sub.z / vec.z) / 2
  distance = decreasing ? Math.max(0, distance - dd) : Math.min(im.getReach(), distance + dd)
  Chat.actionbar(Chat.createTextBuilder().append(prefix).append(`distance set to ${distance.toFixed(4)}`).build())
  updateTarget()
})

JsMacros.on('Key', JavaWrapper.methodToJava(e => {
  if (e.key !== key) {
    if (state && pressed) configuring = true
    return
  }
  pressed = e.action === 1
  if (state) {
    if (pressed) {
      box.setColor(0xFFFF00)
      scrollListener ??= JsMacros.on('MouseScroll', true, scrollCallback)
    } else {
      box.setColor(0x00FFFF)
      if (scrollListener) {
        JsMacros.off('MouseScroll', scrollListener)
        scrollListener = null
      }
    }
  }
  if (!pressed) {
    if (configuring) configuring = false
    else {
      state = !state
      if (state) {
        pos = PositionCommon.createBlockPos(0, -999, 0)
        box.setPos(0, -999, 0, 1, -998, 1)
        d3d.register()
        im.setTargetRangeCheck(true, true)
        im.setTargetAirCheck(false, false)
        im.setTargetShapeCheck(false, false)
      } else {
        d3d.unregister()
        im.clearTargetOverride()
        im.resetTargetChecks()
      }
      Chat.actionbar(Chat.createTextBuilder().append(prefix).append(state ? 'enabled' : 'disabled').build())
    }
  }
}))

JsMacros.on('Tick', JavaWrapper.methodToJava(updateTarget))

JsMacros.on('DimensionChange', JavaWrapper.methodToJava(() => {
  im = Player.getInteractionManager()
}))

function updateTarget() {
  if (!state) return
  if (distance > im.getReach()) distance = im.getReach()
  const p = Player.getPlayer()
  const newPos = PositionCommon
    .createLookingVector(p)
    .normalize()
    .getEnd()
    .scale(distance)
    .add(p.getEyePos())
    .toBlockPos()
  if (newPos.equals(pos)) return
  pos = newPos
  box.setPos(pos.getX(), pos.getY(), pos.getZ(), pos.getX() + 1, pos.getY() + 1, pos.getZ() + 1)
  if (World.getBlock(pos)) im.setTarget(pos)
  else im.setTargetMissed()
}

event.stopListener = JavaWrapper.methodToJava(() => {
  d3d.unregister()
  im.clearTargetOverride()
  im.resetTargetChecks()
})
