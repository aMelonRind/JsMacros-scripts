
// can show a ray cast in d3d
// discard the ray by left clicking
// is key script

const D2R = Math.PI / 180

function P2A(pos) {
  return [pos.x, pos.y, pos.z]
}

function lookToVec(pitch = Player.getPlayer().getPitch(), yaw = Player.getPlayer().getYaw()) {
  return Math.abs(pitch) === 90 ? [0, -pitch, 0] : [-Math.sin(yaw *= D2R), -Math.tan(pitch * D2R), Math.cos(yaw)]
}

function rayCast(distance = 420, cull = true, pos = P2A(Player.getPlayer().getPos().add(0, Player.getPlayer().getEyeHeight(), 0)), vec = lookToVec()) {
  const blockPos = pos.map(Math.floor)
  const path = [blockPos.slice()]
  if (cull && World.getBlock(...blockPos)?.getBlockStateHelper().isSolid()) return new rayCastResult(pos, vec, false, null, path)
  const progressPath = []
  const sign = vec.map(Math.sign)
  const vecDist = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2) + (vec[2] ** 2))
  const step = vec.map(v => vecDist / Math.abs(v))
  const progress = pos.map((v, i) => {
    v -= blockPos[i]
    if (sign[i] === 1) v = 1 - v
    v *= step[i]
    return isNaN(v) ? Infinity : v
  })
  while (true) {
    const min = progress.reduce((p, v, i, a) => v < a[p] ? i : p, 0)
    if (progress[min] > distance) return new rayCastResult(pos, vec, false, null, path, progressPath)
    progressPath.push(progress[min])
    blockPos[min] += sign[min]
    if (cull && World.getBlock(...blockPos)?.getBlockStateHelper().isSolid()) return new rayCastResult(pos, vec, true, blockPos, path, progressPath)
    path.push(blockPos.slice())
    progress[min] += step[min]
  }
}

class rayCastResult {
  /**
   * 
   * @param {number[]} pos 
   * @param {number[]} vec 
   * @param {boolean} coll 
   * @param {number[]} hitBlock 
   * @param {number[][]} blockPath 
   * @param {number[]} pointDistPath 
   */
  constructor (pos, vec, coll, hitBlock = null, blockPath = [], pointDistPath = []) {
    this.pos = pos
    this.vec = vec
    this.coll = coll
    this.hitBlock = hitBlock
    this.blockPath = blockPath
    this.pointProgressPath = pointDistPath
  }

  get pointPath () {
    if (this.pointPath$) return this.pointPath$
    const normalize = Math.sqrt(this.vec.map(v => v ** 2).reduce((p, v) => p + v))
    this.vec = this.vec.map(v => v / normalize)
    return this.pointPath$ = this.pointProgressPath.map(prog => this.vec.map((v, i) => v * prog + this.pos[i]))
  }
}


const crossSize = 0.1
const cross = [
  [-1, -1, -1,  1,  1,  1],
  [-1, -1,  1,  1,  1, -1],
  [-1,  1, -1,  1, -1,  1],
  [-1,  1,  1,  1, -1, -1]
].map(v => v.map(n => n * crossSize))

const t = Time.time()
const result = rayCast()
Chat.log(`Cast time: ${Time.time() - t}ms`)

if (result.coll) {
  const d3d = Hud.createDraw3D()
  d3d.register()
  d3d.addBox(...result.hitBlock, ...result.hitBlock.map(v => v + 1), 0x00FF00, 0, false)
  result.blockPath.forEach(p => d3d.addBox(...p, ...p.map(v => v + 1), 0x00FFFF, 0, false))
  result.pointPath.map(v => v.concat(v)).forEach((p, i) => {
    //const color = 0xFFFF00
    const color = result.blockPath[i][0] !== (result.blockPath[i + 1] ?? result.hitBlock)[0] ? 0xFF0000 :
      result.blockPath[i][1] !== (result.blockPath[i + 1] ?? result.hitBlock)[1] ? 0x00FF00 : 0x0000FF
    cross.forEach(m => d3d.addLine(...p.map((v, i) => v + m[i]), color))
  })
  d3d.addLine(...result.pos, ...result.pointPath.at(-1), 0xDDDDDD)
  JsMacros.waitForEvent('Key', JavaWrapper.methodToJava(e => e.key === 'key.mouse.left'))
  d3d.unregister()
}

module.exports = {}
