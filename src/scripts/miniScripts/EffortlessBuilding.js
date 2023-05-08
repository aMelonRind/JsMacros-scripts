
// support ended, can find some useful methods here
// config at Line 89
// is service

const maxSize = 128 - 1
const CreativeInventoryActionC2SPacket = Java.type('net.minecraft.class_2873')
const ClientPlayNetworkHandler = Client.getMinecraft().method_1562()
const Identifier = Java.type('net.minecraft.class_2960')
const BlockPosHelper = Java.type('xyz.wagyourtail.jsmacros.client.api.helpers.BlockPosHelper')
const SideToVec = {
  down:  [ 0, -1,  0],
  up:    [ 0,  1,  0],
  north: [ 0,  0, -1],
  south: [ 0,  0,  1],
  west:  [-1,  0,  0],
  east:  [ 1,  0,  0]
}
const P2A = pos => [pos.getX(), pos.getY(), pos.getZ()]
const D2R = Math.PI / 180
function lookToVec(pitch = Player.getPlayer().getPitch(), yaw = Player.getPlayer().getYaw()) {
  return Math.abs(pitch) == 90 ? [0, -pitch, 0] : [-Math.sin(yaw *= D2R), -Math.tan(pitch * D2R), Math.cos(yaw)]
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

function jump(axis, to, cull = false, vec = lookToVec(), pos = P2A(Player.getPlayer().getPos().add(0, Player.getPlayer().getEyeHeight(), 0))) {
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

function jumpDistance(dist, cull = false, vec = lookToVec(), pos = P2A(Player.getPlayer().getPos().add(0, Player.getPlayer().getEyeHeight(), 0))) {
  if (cull) {
    const raycastr = raycast(dist)
    if (raycastr) return raycastr.result.map((v, i) => v + SideToVec[raycastr.side][i])
  }
  const multiplyer = Math.sqrt((dist ** 2) / ((vec[0] ** 2) + (vec[1] ** 2) + (vec[2] ** 2)))
  return pos.map((v, i) => Math.floor(v + vec[i] * multiplyer))
}

function getWorldYMin() {
  return Client.getMinecraft().field_1687.method_8597().comp_651() // .world.getDimension().minY()
}

function getWorldYMax() {
  return Client.getMinecraft().field_1687.method_8597().comp_652() + getWorldYMin() - 1 // .world.getDimension().height()
}

const infod2d = Hud.createDraw2D()
const d3d = Hud.createDraw3D()
const _fillModes = [
  'keep',
  'replace'
]
const fillModes = {
  keep: 0,
  replace: 1
}
const buildModes = {
  plane: 0,
  cube: 1
}
const EBuild = {
  ticking: false,
  pauseTick: false,
  lastTickPos: [null, null, null],
  cursor1: null,
  cursorState: 0, // 0: pos1, 1: pos2
  cursorDist: 80, // distance for jumpDist()
  state1cull: true, 
  buildMode: buildModes.plane,
  fillMode: fillModes.keep,
  doFillTick: false,
  d2dElements: {
    fillQueue: infod2d.addText('', 0, 0, 0xFFFFFF, true)
  },
  d3dboxes: {
    cursor: null
  }
}

const tickStateBehavior = [
  () => { // cursor1
    const trace = raycast()
    const pos = Player.getPlayer().getMainHand().isEmpty() ? trace?.result : trace?.result.map((v, i) => v + SideToVec[trace.side][i])
    if (!trace || pos[1] < getWorldYMin() || pos[1] > getWorldYMax()) {
      if (EBuild.d3dboxes.cursor) {
        d3d.removeBox(EBuild.d3dboxes.cursor)
        EBuild.d3dboxes.cursor = null
        EBuild.lastTickPos.fill(null)
      }
      return null
    }
    if (EBuild.lastTickPos.filter((v, i) => v == pos[i]).length === 3) return pos
    if (EBuild.d3dboxes.cursor) EBuild.d3dboxes.cursor.setPos(...pos.map(v => v - 0.04), ...pos.map(v => v + 1.04))
    else EBuild.d3dboxes.cursor = d3d.addBox(...pos.map(v => v - 0.04), ...pos.map(v => v + 1.04), 0xFF0000, 0x1F00FFFF, true, true)
    return EBuild.lastTickPos = pos
  },
  () => tickModeBehavior[EBuild.buildMode]()
]

const clickStateBehavior = [
  () => { // cursor1
    if (EBuild.lastTickPos.filter(v => v === null).length) return
    EBuild.cursor1 = EBuild.lastTickPos.concat()
    EBuild.cursorState = 1
    EBuild.d3dboxes.cursor?.setColor(0xFFFF00)
  },
  () => clickModeBehavior[EBuild.buildMode]()
]

const tickModeBehavior = [
  () => { // mode0: plane
    const axis = [0]
    let pos = undefined
    const p = Player.getPlayer()
    const pitch = p.getPitch()
    const yaw = p.getYaw()
    const ppos = P2A(p.getPos().add(0, p.getEyeHeight(), 0))
    if (Math.abs(yaw) > 45 && Math.abs(yaw) <= 135) axis.push(2)
    else axis.unshift(2)
    if (Math.abs(pitch) < 45) axis.push(1)
    else axis.unshift(1)
    for (const a of axis) {
      pos = jump(a, EBuild.cursor1[a] + 0.5, EBuild.state1cull, lookToVec(pitch, yaw), ppos)
      if (pos) {
        pos.map(v => Math.floor(v))
        break
      }
    }
    if (!pos) {
      if (EBuild.d3dboxes.cursor) EBuild.d3dboxes.cursor = !d3d.removeBox(EBuild.d3dboxes.cursor)
      EBuild.lastTickPos.fill(null)
      return null
    }
    pos[1] = Math.max(getWorldYMin(), pos[1])
    pos[1] = Math.min(getWorldYMax(), pos[1])
    pos = pos.map((v, i) => Math.max(EBuild.cursor1[i] - maxSize, (Math.min(v, EBuild.cursor1[i] + maxSize))))
    if (EBuild.lastTickPos.filter((v, i) => v === pos[i]).length === 3) return pos
    if (EBuild.d3dboxes.cursor) EBuild.d3dboxes.cursor.setPos(
      ...EBuild.cursor1.map((v, i) => Math.min(v, pos[i]) - 0.04),
      ...EBuild.cursor1.map((v, i) => Math.max(v, pos[i]) + 1.04)
    )
    else EBuild.d3dboxes.cursor = d3d.addBox(
      ...EBuild.cursor1.map((v, i) => Math.min(v, pos[i]) - 0.04),
      ...EBuild.cursor1.map((v, i) => Math.max(v, pos[i]) + 1.04), 0xFFFF00, 0x1F00FFFF, true, true
    )
    return EBuild.lastTickPos = pos
  },
  () => { // mode1: cube
    let pos = jumpDistance(EBuild.cursorDist, EBuild.state1cull)
    if (!pos) {
      if (EBuild.d3dboxes.cursor) EBuild.d3dboxes.cursor = !d3d.removeBox(EBuild.d3dboxes.cursor)
      EBuild.lastTickPos.fill(null)
      return null
    }
    pos[1] = Math.max(getWorldYMin(), pos[1])
    pos[1] = Math.min(getWorldYMax(), pos[1])
    pos = pos.map((v, i) => Math.max(EBuild.cursor1[i] - maxSize, (Math.min(v, EBuild.cursor1[i] + maxSize))))
    if (EBuild.lastTickPos.filter((v, i) => v === pos[i]).length === 3) return pos
    if (EBuild.d3dboxes.cursor) EBuild.d3dboxes.cursor.setPos(
      ...EBuild.cursor1.map((v, i) => Math.min(v, pos[i]) - 0.04),
      ...EBuild.cursor1.map((v, i) => Math.max(v, pos[i]) + 1.04)
    )
    else EBuild.d3dboxes.cursor = d3d.addBox(
      ...EBuild.cursor1.map((v, i) => Math.min(v, pos[i]) - 0.04),
      ...EBuild.cursor1.map((v, i) => Math.max(v, pos[i]) + 1.04), 0xFFFF00, 0x1F00FFFF, true, true
    )
    return EBuild.lastTickPos = pos
  }
]

const fillQueue = [] // [{block: string, mode: string, d3dbox: Draw3D$Box, boxes: [pos1: number[], pos2: number[]][]}] both pos should be in same chunk
function fillTick() {
  if (!EBuild.doFillTick) return
  let filled = false
  outer:
  for (const i in fillQueue) if (fillQueue[i]) 
  for (const b in fillQueue[i].boxes) if (fillQueue[i].boxes[b]){
    if (!World.getBlock(...fillQueue[i].boxes[b][0])) continue
    //if (World.findBlocksMatching(
    //  Math.floor(fillQueue[i].boxes[b][0][0] >> 4),
    //  Math.floor(fillQueue[i].boxes[b][0][2] >> 4),
    //  JavaWrapper.methodToJava(),
    //  JavaWrapper.methodToJava(),
    //  0))
    Chat.say(`/fill ${fillQueue[i].boxes[b].flat().join(' ')} ${fillQueue[i].block} ${fillQueue[i].mode}`)
    fillQueue[i].boxes.splice(b, 1)
    if (!fillQueue[i].boxes.length) {
      animations.d3d.fade.push({d3dbox: fillQueue[i].d3dbox, alpha: 128, da: -16})
      fillQueue.splice(i, 1)
    }
    filled = true
    break outer
  }
  if (!fillQueue.length) {
    EBuild.d2dElements.fillQueue.setText('')
    infod2d.removeElement(EBuild.d2dElements.fillQueue)
    EBuild.doFillTick = false
    return
  }
  EBuild.d2dElements.fillQueue.setText(`${fillQueue.length} Fill Queue left, ${
    fillQueue.map(v => v.boxes).flat().length} boxes left${filled ? '' : ', Some chunk is not loaded.'}`)
}

const clickModeBehavior = [
  () => { // mode0: plane
    if (EBuild.lastTickPos.filter(v => v === null).length) return
    const pos = EBuild.lastTickPos.concat()
    EBuild.cursorState = 0
    EBuild.lastTickPos.fill(null)
    EBuild.d3dboxes.cursor?.setColor(0xFF0000)
    
    EBuild.cursor1.forEach((v, i, a) => {
      if (pos[i] < a[i]) {
        a[i] = pos[i]
        pos[i] = v
      }
    }) // slice chunks to below fill limit 32768 && avoid chunk not loaded error
    const chunkRange = [
      Math.floor(EBuild.cursor1[0] >> 4),
      Math.floor(EBuild.cursor1[2] >> 4),
      Math.floor(pos[0]            >> 4),
      Math.floor(pos[2]            >> 4)
    ]
    const boxes = []
    for (let chunky = chunkRange[1]; chunky <= chunkRange[3]; chunky++)
    for (let chunkx = chunkRange[0]; chunkx <= chunkRange[2]; chunkx++) {
      const xyrange = [
        Math.max((chunkx << 4)     , EBuild.cursor1[0]),
        Math.max((chunky << 4)     , EBuild.cursor1[2]),
        Math.min((chunkx << 4) + 15, pos[0]),
        Math.min((chunky << 4) + 15, pos[2])
      ]
      const dy = Math.floor(32768 / ((xyrange[2] - xyrange[0] + 1) * (xyrange[3] - xyrange[1] + 1)))
      let y = EBuild.cursor1[1]
      while (y <= pos[1]) boxes.push([[xyrange[0], y, xyrange[1]], [xyrange[2], (y = Math.min(y + dy, pos[1] + 1)) - 1, xyrange[3]]])
    }
    const block = Player.getPlayer().getMainHand().getItemId() // TODO: detect if it's a block
    fillQueue.push({
      block,
      mode: block.slice(-4) === ':air' ? 'replace' : _fillModes[EBuild.fillMode],
      d3dbox: d3d.addBox(...EBuild.cursor1.map(v => v - 0.04), ...pos.map(v => v + 1.04), 0xFFFF00, 0x0FFFFF00, true),
      boxes
    })
    infod2d.reAddElement(EBuild.d2dElements.fillQueue)
    EBuild.doFillTick = true
  },
  () => clickModeBehavior[0]() // mode1: cube
]

const animations = {
  d3d:{
    fade: [] // {d3dbox: Draw3D$Box, alpha: number, da: -(0x10)}
  }
}

function animationTick() {
  for (const i in animations.d3d.fade) {
    animations.d3d.fade[i].alpha += animations.d3d.fade[i].da
    if (animations.d3d.fade[i].alpha <= 0 || animations.d3d.fade[i].alpha > 255) {
      d3d.removeBox(animations.d3d.fade[i].d3dbox)
      animations.d3d.fade.splice(i, 1)
      continue
    }
    animations.d3d.fade[i].d3dbox.setFillAlpha(animations.d3d.fade[i].alpha)
    animations.d3d.fade[i].d3dbox.setAlpha(animations.d3d.fade[i].alpha)
  }
}

function rightClick() { // place
  EBuild.pauseTick = true
  while (EBuild.ticking) Time.sleep(10)
  clickStateBehavior[EBuild.cursorState]()
  EBuild.pauseTick = false
}

function cancel() {
  EBuild.pauseTick = true
  while (EBuild.ticking) Time.sleep(10)
  EBuild.cursorState = 0
  EBuild.pauseTick = false
}

function pickBlock() {
  if (EBuild.lastTickPos.filter(v => v === null).length) return
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
    Java.type('net.minecraft.class_2378').field_11142.method_10223(new Identifier(blockid)).method_7854()
  ))
}

function tick() {
  if (EBuild.pauseTick || EBuild.ticking) return
  EBuild.ticking = true
  tickStateBehavior[EBuild.cursorState]()
  fillTick()
  animationTick()
  EBuild.ticking = false
}

infod2d.setOnInit(JavaWrapper.methodToJava(() => {
  EBuild.d2dElements.fillQueue.setPos(Math.floor(infod2d.getWidth() / 2) - 80, infod2d.getHeight() - 160)
  infod2d.reAddElement(EBuild.d2dElements.fillQueue)
}))

JsMacros.on('Tick', JavaWrapper.methodToJava(tick))

JsMacros.on('Key', JavaWrapper.methodToJava(e => {
  if (e.action !== 1) return
  switch (e.key) {
    case 'key.mouse.right':
      rightClick()
      break
    case 'key.mouse.left':
      cancel()
      break
    case 'key.mouse.middle':
      pickBlock()
      break
  }
}))

infod2d.register()
d3d.register()

event.stopListener = JavaWrapper.methodToJava(() => {
  infod2d.unregister()
  d3d.unregister()
})

/* // trash
function getTraceSide(block, pos = P2A(Player.getPlayer().getPos().add(0, Player.getPlayer().getEyeHeight(), 0)), vec = lookToVec()) {
  for (let v of [1, 0, 2]) if (pos[v] < block[v] || pos[v] > block[v] + 1) {
    pos = jump(v, block[v] + (Math.sign(vec[v]) == -1 ? 1 : 0), pos, vec) ?? pos
    if (pos[(++v > 2 ? v -= 3 : v)] >= block[v] && pos[v] <= block[v] + 1
     && pos[(++v > 2 ? v -= 3 : v)] >= block[v] && pos[v] <= block[v] + 1)
      return [(++v > 2 ? v -= 3 : v), 0, 0].map((_, p) => p == v ? (pos[v] == block[v] ? -1 : 1) : 0)
  }
  return [0, 0, 0]
}
*/

/* // this raytrace i made slow asf, but at least modifiable
function RayTrace(pos = P2A(Player.getPlayer().getPos().add(0, Player.getPlayer().getEyeHeight(), 0)), vec = lookToVec(),
    distance = 420) {
  const blockPos = [Math.floor(pos.x), Math.floor(pos.y), Math.floor(pos.z)]
  if (World.getBlock(...blockPos)?.getBlockStateHelper().isSolid()) return {reflect: false, blockPos}
  const sign = [Math.sign(vec[0]), Math.sign(vec[1]), Math.sign(vec[2])]
  const vecDist = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2) + (vec[2] ** 2))
  const step = [vecDist / Math.abs(vec[0]), vecDist / Math.abs(vec[1]), vecDist / Math.abs(vec[2])]
  const progress = [pos.x - blockPos[0], pos.y - blockPos[1], pos.z - blockPos[2]]
  for (const i in progress) {
    if (sign[i] === 1) progress[i] = 1 - progress[i]
    progress[i] *= step[i]
    if (isNaN(progress[i])) progress[i] = Infinity
  }
  if (Math.min(...progress) === Infinity) return {reflect: false, blockPos}
  while (true) {
    const min = progress.indexOf(Math.min(...progress))
    if (progress[min] > distance) return {reflect: false, blockPos}
    blockPos[min] += sign[min]
    const b = World.getBlock(...blockPos)
    if ( b?.getBlockStateHelper().isSolid()) return {reflect: true, blockPos, point: [pos.x, pos.y, pos.z]}
    progress[min] += step[min]
  }
}
*/

module.exports = {}
