
/**
 * @typedef {_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Vec3D} Vec3D
 * @typedef {_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D} Pos3D
 */

/** @param {import('../util')} util */
module.exports = util => {
  if (!util.toJava) throw new Error('util needed')

  /** 
   * @type {xyz.wagyourtail.jsmacros.client.api.helpers.ClientPlayerEntityHelper}
   * @readonly bec i prefer readonly color
   */
  let p
  let wt
  return {

    /**
     * xz1 <= xz2 && y1 == y2
     * @type {?Vec3D}
     */
    area: null,

    /**
     * squared reach distance  
     * for reach check
     */
    reachSq: 25,

    /**
     * timeout in ticks
     * @type {number}
     */
    cantMoveTimeout: 60,
    _queue: [],

    /**
     * 
     * @param {number[][]} pos 
     */
    setArea(pos) {
      this.area = util.math.toPositiveVec(util.Vec(...pos.flat()))
    },

    /**
     * Try to stand on the coordinate, strightly, no pathfinding
     * @param {number[]} coords 
     * @param {?(p: xyz.wagyourtail.jsmacros.client.api.helpers.ClientPlayerEntityHelper) => boolean} orCondition
     * @returns success
     */
    async simpleWalk(coords, orCondition) {
      if (!Array.isArray(coords)) coords = [coords.x, coords.y, coords.z]
      coords.length = 3
      if (this._queue[0]) await new Promise(res => this._queue.push(res))
      this._queue[0] = true
      if (Hud.isContainer()) Player.openInventory().close()
      p = Player.getPlayer()
      const pos = util.Pos(...coords.map(Math.floor)).add(0.5, 0, 0.5)
      let lastPos = p.getPos()
      let timeout = 0
      let y, pit
      let distSq = p.getPos().toVector(pos).getMagnitudeSq()
      util.option.setAutoJump(true)
      while (distSq > 0.5 && !orCondition?.(p)) {
        await util.lookAt(y = util.getYawFromXZ(pos.x, pos.z), pit = p.getPitch())
        await wt
        if (lastPos.toVector(p.getPos()).getMagnitudeSq() > 0.3) {
          lastPos = p.getPos()
          timeout = 0
        }else if (++timeout > this.cantMoveTimeout) {
          Player.clearInputs()
          Player.addInput(Player.createPlayerInput(0, 0, y, pit, false, false, false))
          await util.waitTick()
          Player.clearInputs()
          this._queue.shift()
          this._queue[0]?.()
          return false
        }
        distSq = p.getPos().toVector(pos).getMagnitudeSq()
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
    },

    /**
     * Try to reach the coordinate, strightly, no pathfinding
     * @param {number[]} coords 
     * @param {?(p: xyz.wagyourtail.jsmacros.client.api.helpers.ClientPlayerEntityHelper) => boolean} orCondition
     * @returns success
     */
    async simpleWalkReach(coords, orCondition) {
      coords.length = 3
      p = Player.getPlayer()
      const pos = util.Pos(...coords).add(0.5, -p.getEyeHeight() + 0.5, 0.5)
      if (p.getPos().toVector(pos).getMagnitudeSq() < this.reachSq) return true
      const nearest = this.getNearestCoords(util.Pos(...coords))
      if (pos.add(-0.5, -0.5, -0.5).toVector(nearest).getMagnitudeSq() > this.reachSq + 10)
        util.throw("can't reach out of area")
      await this.simpleWalk(nearest, () =>
        p.getPos().toVector(pos).getMagnitudeSq() < this.reachSq || orCondition?.(p)
      )
      return p.getPos().toVector(pos).getMagnitudeSq() < this.reachSq + 2
    },

    /**
     * 
     * @param {Pos3D} pos 
     * @returns nearest coords in area
     */
    getNearestCoords(pos) {
      if (Array.isArray(pos)) pos = util.Pos(...pos)
      return !this.area ? pos : util.Pos(
        util.math.clamp(Math.floor(pos.x), this.area.x1, this.area.x2) + 0.5,
        util.math.clamp(Math.floor(pos.y), this.area.y1, this.area.y2) + 0.5,
        util.math.clamp(Math.floor(pos.z), this.area.z1, this.area.z2) + 0.5
      )
    }

  }
}
