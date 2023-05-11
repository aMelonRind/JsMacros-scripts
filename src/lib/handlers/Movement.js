
// util.movement

const util = require('../util')

/** 
 * @type {ClientPlayer}
 * @readonly bec i prefer readonly color
 */
let p
/**
 * waitTick Promise
 * @type {Promise<*>=}
 */
let wt

class MovementHandler {

  /**
   * xz1 <= xz2 && y1 == y2
   * @type {?Vec3D}
   */
  area = null

  /** @deprecated util.reachSq */
  get reachSq() { return util.reachSq }
  /** @deprecated util.reachSq */
  set reachSq(r) { util.reachSq = r }

  /**
   * timeout in ticks
   * @type {number}
   */
  cantMoveTimeout = 60
  /** @type {*[]} */
  _queue = []

  /**
   * set the area that player can walk
   * @param {?Vec3DLike} area 
   */
  setArea(area) {
    this.area = area ? util.math.toPositiveVec(area) : null
  }

  /**
   * Try to stand on the coordinate, strightly, no pathfinding  
   * sometimes break while in freecam mode
   * @param {Pos3DLike} pos 
   * @param {Condition<[p: ClientPlayer]>} [orCondition] 
   * @returns success
   */
  async walkTo(pos, orCondition) {
    const pos3 = util.toPos(pos)
    if (this._queue[0]) await new Promise(res => this._queue.push(res))
    this._queue[0] = true
    if (Hud.isContainer()) Player.openInventory().close()
    p = Player.getPlayer()
    let lastPos = p.getPos()
    let timeout = 0
    let y, pit
    let distSq = p.getPos().toVector(pos3).getMagnitudeSq()
    util.option.setAutoJump(true)
    while (distSq > 0.5 && !orCondition?.(p)) {
      await util.lookAtAngle(y = util.getYawFromXZ(pos3.x, pos3.z), pit = p.getPitch())
      await wt
      if (lastPos.toVector(p.getPos()).getMagnitudeSq() > 0.3) {
        lastPos = p.getPos()
        timeout = 0
      } else if (++timeout > this.cantMoveTimeout) {
        Player.clearInputs()
        Player.addInput(Player.createPlayerInput(0, 0, y, pit, false, false, false))
        await util.waitTick()
        Player.clearInputs()
        this._queue.shift()
        this._queue[0]?.()
        return false
      }
      distSq = p.getPos().toVector(pos3).getMagnitudeSq()
      Player.clearInputs()
      Player.addInput(Player.createPlayerInput(1, 0, y, pit, false, false, distSq > 4))
      wt = util.waitTick()
    }
    Player.clearInputs()
    Player.addInput(Player.createPlayerInput(0, 0, y ?? p.getYaw(), pit ?? p.getPitch(), false, false, false))
    await util.waitTick()
    Player.clearInputs()
    util.waitTick(2, Player.clearInputs)
    this._queue.shift()
    this._queue[0]?.()
    return true
  }

  /**
   * Try to reach the coordinate, strightly, no pathfinding
   * @param {Pos3DLike} pos 
   * @param {(p: ClientPlayer) => boolean} [orCondition] 
   * @returns success
   */
  async walkReach(pos, orCondition) {
    let pos3 = util.toPos(pos)
    p = Player.getPlayer()
    pos3 = pos3.add(0.5, -p.getEyeHeight() + 0.5, 0.5)
    if (p.getPos().toVector(pos3).getMagnitudeSq() < util.reachSq) return true
    const nearest = this.getNearestCoords(pos3)
    if (pos3.toVector(nearest).getMagnitudeSq() > util.reachSq + 16)
      util.throw("can't reach out of area")
    await this.walkTo(nearest, () =>
      p.getPos().toVector(pos3).getMagnitudeSq() < util.reachSq || orCondition?.(p)
    )
    return p.getPos().toVector(pos3).getMagnitudeSq() < util.reachSq + 2
  }

  /**
   * @param {Pos3DLike} pos 
   * @returns {Pos3D} nearest coords in area
   */
  getNearestCoords(pos) {
    const pos3 = util.toPos(pos)
    return !this.area ? pos3 : util.Pos(
      util.math.clamp(Math.floor(pos3.x), this.area.x1, this.area.x2) + 0.5,
      util.math.clamp(Math.floor(pos3.y), this.area.y1, this.area.y2) + 0.5,
      util.math.clamp(Math.floor(pos3.z), this.area.z1, this.area.z2) + 0.5
    )
  }

}

module.exports = new MovementHandler
