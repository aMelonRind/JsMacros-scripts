
// long distance build on plane
// requires /setblock perm
// is service

const BlockPosHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.BlockPosHelper')
const P2A = pos => [pos.getX(), pos.getY(), pos.getZ()]
const cast = raycast()
if (!cast) throw 'look at block'
const p = Player.getPlayer()
let pos
let pitch
let yaw = p.getYaw()
const axis  = (Math.abs(yaw) > 45 && Math.abs(yaw) <= 135) ? 0 : 2
const value = cast.result[axis] + 0.5
Chat.log(`bound to ${axis ? 'z' : 'x'} = ${value - 0.5}`)

const CreativeInventoryActionC2SPacket = Java.type("net.minecraft.class_2873")
const ClientPlayNetworkHandler = Client.getMinecraft().method_1562()
const Identifier = Java.type("net.minecraft.class_2960")

const D2R = Math.PI / 180
function lookToVec(pitch = p.getPitch(), yaw = p.getYaw()) {
  return Math.abs(pitch) == 90 ? [0, -pitch, 0] : [-Math.sin(yaw *= D2R), -Math.tan(pitch * D2R), Math.cos(yaw)]
}

/** @type {Draw3D} */
const d3d = Reflection.createClassProxyBuilder(
    Java.type('xyz.wagyourtail.jsmacros.client.api.classes.Draw3D'))
    .addMethod('render', JavaWrapper.methodToJava((ref, args) => {
  if (pitch === p.getPitch() && yaw === p.getYaw() && pos === P2A(p.getPos()).join(',')) return ref.parent(args)
  pitch = p.getPitch()
  yaw = p.getYaw()
  pos = P2A(p.getPos()).join(',')
  const snap = jump(axis, value, true)
  if (snap) {
    enabled = true
    if (cursor.x1 === snap[0] && cursor.y1 === snap[1] && cursor.z1 === snap[2]) return ref.parent(args)
    else updateCursor(snap)
  }else {
    enabled = false
    updateCursor()
  }
  ref.parent(args) // super
})).buildInstance([])
let enabled = false
let cursorpos = []
const cursor = d3d.addBox(0, 0, 0, 0, 0, 0, 0x00FFFF, 255, 0x00FFFF, 64, true)
const xzlines = new Array(6).fill().map(() => d3d.addLine(0, 0, 0, 0, 0, 0, 0x00FF00, 64))
const ylines  = new Array(6).fill().map(() => d3d.addLine(0, 0, 0, 0, 0, 0, 0x00FF00, 64))
d3d.register()

JsMacros.on('Key', JavaWrapper.methodToJava(e => {
  if (e.action !== 1) return
  switch (e.key) {
    case 'key.mouse.right':
      if (enabled)
      Chat.say(`/setblock ${cursorpos.join(' ')} ${p.getMainHand().getItemId()}`)
      break
    case 'key.mouse.left':
      if (enabled)
      Chat.say(`/setblock ${cursorpos.join(' ')} air`)
      break
    case 'key.mouse.middle':
      pickBlock()
      break
  }
}))

function updateCursor(pos) {
  if (pos) {
    cursorpos = pos
    cursor.setPos(...pos, ...pos.map(v => v + 1))
    xzlines.forEach((l, i) => {
      if (!axis) l.setPos(value, pos[1] - 3, pos[2] - 2 + i, value, pos[1] + 4, pos[2] - 2 + i)
      else       l.setPos(pos[0] - 2 + i, pos[1] - 3, value, pos[0] - 2 + i, pos[1] + 4, value)
    })
    ylines.forEach((l, i) => {
      if (!axis) l.setPos(value, pos[1] - 2 + i, pos[2] - 3, value, pos[1] - 2 + i, pos[2] + 4)
      else       l.setPos(pos[0] - 3, pos[1] - 2 + i, value, pos[0] + 4, pos[1] - 2 + i, value)
    })
  }
  const color = enabled && (World.getBlock(...pos)?.getBlockStateHelper().isAir() ?? false) ? 0x00FFFF : 0xFF0000
  cursor.setColor(color)
  cursor.setFillColor(color)
}

event.stopListener = JavaWrapper.methodToJava(() => {
  d3d.unregister()
})

function pickBlock() {
  const trace = raycast()
  if (!trace) return
  const inv = Player.openInventory()
  const blockid = World.getBlock(...trace.result).getId()
  for (const i in inv.getMap().hotbar) if (inv.getSlot(inv.getMap().hotbar[i]).getItemId() === blockid) {
    inv.setSelectedHotbarSlotIndex(i)
    return
  }
  if (!inv.getSlot(inv.getMap().hotbar[inv.getSelectedHotbarSlotIndex()]).isEmpty()) 
  for (const i in inv.getMap().hotbar) if (inv.getSlot(inv.getMap().hotbar[i]).isEmpty()) {
    inv.setSelectedHotbarSlotIndex(i)
    break
  }
  ClientPlayNetworkHandler.method_2883(new CreativeInventoryActionC2SPacket(
    inv.getMap().hotbar[inv.getSelectedHotbarSlotIndex()],
    Java.type("net.minecraft.class_2378").field_11142.method_10223(new Identifier(blockid)).method_7854()
  ))
}

function raycast(dist = 640) {
  let result = null
  if      (dist > 128 && (result = raycast(128))) return result
  else if (dist > 5   && (result = raycast(5)  )) return result
  result = Player.getPlayer().getRaw()?.method_5745(dist, 0, false)
  // .raycast(maxDistance: D, tickDelta: F, includeFluids: Z): HitResult
  return (!result || `${result.method_17783()}` == 'MISS') ? null : // .getType(): HitResult$Type
  {result: P2A(new BlockPosHelper(result.method_17777())), side: result.method_17780()}
  // .getBlockPos(), .getSide()
}

function jump(axis, to, cull = false, vec = lookToVec(), pos = P2A(p.getPos().add(0, p.getEyeHeight(), 0))) {
  const offset = to - pos[axis]
  if (offset === 0) return pos
  if (Math.sign(offset) !== Math.sign(vec[axis])) return null
  const n = offset / vec[axis]
  const result = pos.map((p, i) => Math.floor(p + vec[i] * n))
  if (cull) {
    const raycastr = raycast()
    if (!raycastr || raycastr.result.filter((v, i) => Math.abs(v - result[i]) < 2).length === 3) return result
    const distanceVec = result.map((v, i) => (v - pos[i]) ** 2)
    const raycastDist = raycastr.result.map((v, i) => (v - pos[i]) ** 2) ?? [Infinity, 0, 0]
    if ((distanceVec[0] + distanceVec[1] + distanceVec[2]) * 0.95 > raycastDist[0] + raycastDist[1] + raycastDist[2]) return null
  }
  return result
}