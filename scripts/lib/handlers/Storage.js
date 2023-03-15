
// util.storage

/** @typedef {import('../type/myTypes')} */

/** @param {Util} util */
module.exports = util => {
  if (!util?.toJava) throw new Error('util needed')
  util.movement
  util.container

  let skipTop = true
  let possibleContainer = [/(?<!minecraft:ender_)chest$/, /shulker_box$/, 'minecraft:barrel']
  const chestDirection = {
    northright: util.Pos(-1, 0,  0),
    northleft:  util.Pos( 1, 0,  0),
    southright: util.Pos( 1, 0,  0),
    southleft:  util.Pos(-1, 0,  0),
    westright:  util.Pos( 0, 0,  1),
    westleft:   util.Pos( 0, 0, -1),
    eastright:  util.Pos( 0, 0, -1),
    eastleft:   util.Pos( 0, 0,  1)
  }

  /** @type {{ [group: string]: ContainerChunk[] }} */
  const storages = {}

  class ContainerChunk {
    
    /**
     * 
     * @param {Vec3DLike} box 
     */
    constructor(box) {
      this.box = util.math.toPositiveVec(box)
      this.anchor = {x: box.x1 >> 4, z: box.z1 >> 4}
      /**
       * @type {{ [pos: string]: {
       *  pos: Pos3D,
       *  onTop1?: string,
       *  onTop2?: string,
       *  items: Dict
       * } }}
       */
      this.containers = {}
      /** @type {Dict} */
      this.total = {}
      /** @type {string[]} */
      this.empty = []
      /** @type {string[]} */
      this.hasEmpty = []
      // /** @type {{ [chunkpos: string]: string[] }} */
      // this.chunkToContainerMap = {}
      this.initialized = false
      this.scanned = false
      this.scanResult = {chest: [], other: []}
      this.waitForChunk = new Array((box.x2 >> 4) - this.anchor.x + 1).fill().map(() =>
        new Array((box.z2 >> 4) - this.anchor.z + 1).fill(true)
      )
      util.debug.log?.(`[storage] container chunk created (${toStrPos(this.box.getStart())})`)
    }

    scanChunks() {
      if (!this.waitForChunk) return
      this.waitForChunk.forEach((zarr, x) => zarr?.forEach?.((status, z) => {
        if (!status) return
        if (!World.isChunkLoaded(this.anchor.x + x, this.anchor.z + z)) return
        if (status === true &&
          !(World.isChunkLoaded(this.anchor.x + x + 1, this.anchor.z + z) &&
            World.isChunkLoaded(this.anchor.x + x - 1, this.anchor.z + z) &&
            World.isChunkLoaded(this.anchor.x + x, this.anchor.z + z + 1) &&
            World.isChunkLoaded(this.anchor.x + x, this.anchor.z + z - 1))) {
          // convert to bitfield 1nswe indicates which chunk also need to be loaded
          // due to half double chests
          status = 16
          // north
          if (this.anchor.z + z > this.box.z1 && // if the box exceeds this chunk
            scanHalfChest(util.Vec(
              Math.max((this.anchor.x + x) * 16, this.box.x1),
              this.box.y1,
              (this.anchor.z + z) * 16,
              Math.min((this.anchor.x + x) * 16 + 15, this.box.x2),
              this.box.y2,
              (this.anchor.z + z) * 16
            ), 'west', 'east')
          ) status |= 8
          // south
          if (this.anchor.z + z + 15 < this.box.z2 &&
            scanHalfChest(util.Vec(
              Math.max((this.anchor.x + x) * 16, this.box.x1),
              this.box.y1,
              (this.anchor.z + z) * 16 + 15,
              Math.min((this.anchor.x + x) * 16 + 15, this.box.x2),
              this.box.y2,
              (this.anchor.z + z) * 16 + 15
            ), 'east', 'west')
          ) status |= 4
          // west
          if (this.anchor.x + x > this.box.x1 &&
            scanHalfChest(util.Vec(
              (this.anchor.x + x) * 16,
              this.box.y1,
              Math.max((this.anchor.z + z) * 16, this.box.z1),
              (this.anchor.x + x) * 16,
              this.box.y2,
              Math.min((this.anchor.z + z) * 16 + 15, this.box.z2)
            ), 'south', 'north')
          ) status |= 2
          // east
          if (this.anchor.x + x + 15 < this.box.x2 &&
            scanHalfChest(util.Vec(
              (this.anchor.x + x) * 16 + 15,
              this.box.y1,
              Math.max((this.anchor.z + z) * 16, this.box.z1),
              (this.anchor.x + x) * 16 + 15,
              this.box.y2,
              Math.min((this.anchor.z + z) * 16 + 15, this.box.z2)
            ), 'north', 'south')
          ) status |= 1
          zarr[z] = status
        }
        // check bitfield
        if (status !== true && (
          ((status & 8) && !World.isChunkLoaded(this.anchor.x + x, this.anchor.z + z - 1)) ||
          ((status & 4) && !World.isChunkLoaded(this.anchor.x + x, this.anchor.z + z + 1)) ||
          ((status & 2) && !World.isChunkLoaded(this.anchor.x + x - 1, this.anchor.z + z)) ||
          ((status & 1) && !World.isChunkLoaded(this.anchor.x + x + 1, this.anchor.z + z)))) return
        // scan
        const area = util.Vec(
          Math.max((this.anchor.x + x) * 16, this.box.x1),
          this.box.y1,
          Math.max((this.anchor.z + z) * 16, this.box.z1),
          Math.min((this.anchor.x + x) * 16 + 15, this.box.x2),
          this.box.y2,
          Math.min((this.anchor.z + z) * 16 + 15, this.box.z2)
        )
        const chests = []
        const others = []
        
        for (let y = area.y1; y <= area.y2; y++)
        for (let z = area.z1; z <= area.z2; z++)
        for (let x = area.x1; x <= area.x2; x++) {
          const block = World.getBlock(x, y, z)
          const id = block.getId()
          if (!possibleContainer.some(v => (typeof v === 'string') ? id === v : v.test(id))) continue
          ;(id === 'minecraft:chest' ? chests : others).push(util.Pos(x, y, z))
        }
        this.scanResult.chest.push(...chests.map(pos => {
          const state = World.getBlock(pos).getBlockState()
          return { pos, facing: state.facing, type: state.type }
        }))
        this.scanResult.other.push(...others)
        // this.chunkToContainerMap[`${this.anchor.x + x},${this.anchor.z + z}`] =
        //   chests.map(pos => `${pos.x},${pos.y},${pos.z}`)
        //     .concat(others.map(pos => `${pos.x},${pos.y},${pos.z}`))
        zarr[z] = false
        if (zarr.every(v => !v)) this.waitForChunk[x] = false
      }))
    }

    async init() {
      if (this.initialized) return
      Object.values(storages).forEach(g => g.forEach(s => s.scanChunks()))
      util.debug.log?.(`[storage] block scan start (${this.box.toString()})`)
      while (this.waitForChunk.some(zarr => zarr?.some?.(v => v))) {
        const p = Player.getPlayer()
        const pos = util.Pos((p.getX() >> 4) - this.anchor.x, (p.getZ() >> 4) - this.anchor.z)
        let nearestx = 0
        let nearestz = 0
        let minDist  = Infinity
        this.waitForChunk.forEach((zarr, x) => zarr?.forEach?.((v, z) => {
          if (!v) return
          const dist = pos.toVector(x, z).getMagnitudeSq()
          if (dist < minDist) {
            nearestx = x
            nearestz = z
            minDist = dist
          }
        }))
        util.debug.log?.(`[storage] trying to load chunk (${
          nearestx + this.anchor.x}, ${nearestz + this.anchor.z})`)
        await util.movement.walkTo(
          util.movement.getNearestCoords(util.Pos(
            (nearestx + this.anchor.x) * 16 + 8,
            0,
            (nearestz + this.anchor.z) * 16 + 8,
          )),
          () => World.isChunkLoaded(nearestx, nearestz)
        )
        Object.values(storages).forEach(g => g.forEach(s => s.scanChunks()))
      }
      delete this.waitForChunk
      util.debug.log?.(`[storage] block scan done (${toStrPos(this.box.getStart())})`)
      // all the container should be in the scanResult now
      // time to map them here
      const offsetTable = {}
      const center = util.movement.area ? util.Pos(
        (util.movement.area.x1 + util.movement.area.x2) / 2,
        (util.movement.area.y1 + util.movement.area.y2) / 2,
        (util.movement.area.z1 + util.movement.area.z2) / 2
      ) : Player.getPlayer().getPos()
      while (this.scanResult.chest[0]) {
        const chest = this.scanResult.chest.pop()
        if (chest.type === 'single') {
          this.containers[toStrPos(chest.pos)] = {
            pos: chest.pos,
            onTop1: toStrPos(chest.pos, 1),
            items: {}
          }
          continue
        }
        const otherHalfPos = chest.pos.add(chestDirection[chest.facing + chest.type])
        const otherHalfIndex = this.scanResult.chest.findIndex(v =>
          v.pos.x === otherHalfPos.x && v.pos.y === otherHalfPos.y && v.pos.z === otherHalfPos.z &&
          v.facing === chest.facing && v.type === (chest.type === 'right' ? 'left' : 'right')
        )
        if (otherHalfIndex === -1) {
          chest.type = 'single'
          this.scanResult.chest.push(chest)
          continue
        }
        const otherHalf = this.scanResult.chest.splice(otherHalfIndex, 1)
        if (center.toVector(chest.pos).getMagnitudeSq() <
            center.toVector(otherHalf.pos).getMagnitudeSq()) {
          offsetTable[toStrPos(otherHalf.pos)] = toStrPos(chest.pos)
          this.containers[toStrPos(chest.pos)] = {
            pos: chest.pos,
            onTop1: toStrPos(chest.pos, 1),
            onTop2: toStrPos(otherHalf.pos, 1),
            items: {}
          }
        }else {
          offsetTable[toStrPos(chest.pos)] = toStrPos(otherHalf.pos)
          this.containers[toStrPos(otherHalf.pos)] = {
            pos: otherHalf.pos,
            onTop1: toStrPos(otherHalf.pos, 1),
            onTop2: toStrPos(chest.pos, 1),
            items: {}
          }
        }
      }
      this.scanResult.other.forEach(c => {
        this.containers[toStrPos(c)] = {
          pos: c,
          onTop1: toStrPos(c, 1),
          items: {}
        }
      })
      // tidy up onTops
      Object.values(this.containers).forEach(c => {
        if (c.onTop1 in offsetTable) c.onTop1 = offsetTable[c.onTop1]
        if (c.onTop2 in offsetTable) c.onTop2 = offsetTable[c.onTop2]
        if (!(c.onTop1 in this.containers) || !c.onTop1) delete c.onTop1
        if (!(c.onTop2 in this.containers) || !c.onTop2) delete c.onTop2
        if (!c.onTop1 && c.onTop2) {
          c.onTop1 = c.onTop2
          delete c.onTop2
        }
      })
      util.debug.log?.(`[storage] initialize done (${toStrPos(this.box.getStart())})`)
      this.initialized = true
    }

    async scan() {
      if (!this.initialized) await this.init()
      util.debug.log?.(`[storage] item scan start (${toStrPos(this.box.getStart())})`)
      const list = Object.values(this.containers).map(v => v.pos).sort(
        this.box.getDeltaX() < this.box.getDeltaZ() ?
        (a, b) => a.z - b.z || a.x - b.x || a.y - b.y :
        (a, b) => a.x - b.x || a.z - b.z || a.y - b.y
      ).map(pos => toStrPos(pos))
      const empty = []
      for (const key of list) {
        const data = this.containers[key]
        if (empty.includes(key)) {
          util.debug.log?.(`[storage] skipped (${toStrPos(data.pos)})`)
          if (data.onTop1) empty.push(data.onTop1)
          if (data.onTop2) empty.push(data.onTop2)
          continue
        }
        const inv = await util.container.waitGUI(data.pos)
        if (!inv) {
          util.debug.log?.(`[storage] can't open chest (${toStrPos(data.pos)})`)
          delete this.containers[key]
          continue
        }
        await this.update(key, inv)
        if (skipTop && util.container.calculateSlots(data.items) <= 5) {
          util.debug.log?.(`[storage] skip chest on top of (${toStrPos(data.pos)})`)
          if (data.onTop1) empty.push(data.onTop1)
          if (data.onTop2) empty.push(data.onTop2)
        }
      }
      util.debug.log?.(`[storage] item scan done (${toStrPos(this.box.getStart())})`)
      this.empty = empty
      this.scanned = true
    }

    /**
     * 
     * @param {string | Pos3DLike} pos 
     * @param {Inventory<any>} inv 
     */
    async update(pos, inv) {
      pos = toStrPos(pos)
      if (!(pos in this.containers)) return false
      const last = Java.from(inv.getMap().container).at(-1)
      for (let i = 0; i < 3 && inv.getSlot(last).isEmpty(); i++) await util.waitTick()
      const current = {}
      let hasEmpty = false
      Java.from(inv.getMap().container).map(s => inv.getSlot(s)).forEach(i => {
        if (!i.isEmpty()) {
          current[i.getItemId()] ??= 0
          current[i.getItemId()] += i.getCount()
        }else hasEmpty = true
      })
      if (!hasEmpty && this.hasEmpty.includes(pos))
        this.hasEmpty.splice(this.hasEmpty.indexOf(pos), 1)
      else if (hasEmpty && !this.hasEmpty.includes(pos)) this.hasEmpty.push(pos)
      util.dict.add(this.total, util.dict.sub(util.dict.clone(current), this.containers[pos].items))
      const slots = util.container.calculateSlots(current)
      if (slots && this.empty.includes(pos)) 
        this.empty.splice(this.empty.indexOf(pos), 1)
      else if (!slots && !this.empty.includes(pos)) this.empty.push(pos)
      this.containers[pos].items = current
      return true
    }

    /**
     * delete a container cache
     * @param {string | Pos3DLike} pos 
     * @returns 
     */
    remove(pos) {
      pos = toStrPos(pos)
      if (!(pos in this.containers)) return
      const index = this.empty.indexOf(pos)
      if (index >= 0) this.empty.splice(index, 1)
      util.dict.sub(this.total, this.containers[pos].items)
      delete this.containers[pos]
    }

    /**
     * find nearest container that has {@link id}
     * @param {string} id 
     * @returns {?Pos3D} nearest container
     */
    find(id) {
      if (!this.scanned) util.throw('scan first')
      return util.math.nearest(Object.values(this.containers)
        .filter(c => id in c.items)
        .map(c => c.pos))
    }

    /**
     * find nearest container that has empty slot
     * @returns {?Pos3D}
     */
    findHasEmpty() {
      if (!this.scanned) util.throw('scan first')
      return util.math.nearest(this.hasEmpty.map(k => this.containers[k].pos))
    }

    /**
     * operate items
     * @param {Dict} items 
     * @param {boolean} clear should clear other items or not
     */
    async operate(items, clear = false) {
      const invDict = util.dict.fromInv()
      for (const k in invDict) if (!(k in items)) items[k] = clear ? 0 : invDict[k]
      while (true) {
        util.debug.log?.('[storage] operate looping')
        const need = util.dict.sub(util.dict.clone(items), util.dict.fromInv())
        if (util.dict.isEmpty(need, true)) return true
        const dumping = Object.values(need).some(v => v < 0)
        if (dumping) {
          const pos = this.findHasEmpty()
          if (!pos) return false
          const inv = await util.container.waitGUI(pos)
          if (!inv) return false
          await util.container.operate(inv, items)
          this.update(pos, inv)
        }else {
          const item = Object.keys(need).find(k => need[k] > 0)
          const pos = this.find(item)
          if (!pos) return false
          const inv = await util.container.waitGUI(pos)
          if (!inv) return false
          await util.container.operate(inv, items)
          this.update(pos, inv)
        }
      }
    }

  }

  return {

    /**
     * @readonly
     */
    get storages() {
      return storages
    },

    /**
     * @param {boolean} bool
     */
    set skipTop(bool = true) {
      skipTop = !!bool
    },

    ContainerChunk,

    get possibleContainer() {
      return possibleContainer.slice()
    },
    
    set possibleContainer(list) {
      if (!list.every(id => (id instanceof RegExp) || (typeof id === 'string')))
        util.throw(`value of PossibleContainer must be RegExp or string! (${list.join(', ')})`)
      possibleContainer = list
    },

    /**
     * create storage instance
     * @param {{ [group: string]: Vec3DLike[] }} dict 
     */
    create(dict) {
      Object.keys(dict).forEach(g => {
        storages[g] = dict[g].map(box =>
          new ContainerChunk(box)
        )
      })
    },

    /**
     * map and scan cache for items
     * @param {string} group 
     */
    async scan(group) {
      for (const cchunk of storages[group]) await cchunk.scan()
      // clean overlap container chunk
      storages[group].forEach((v, i, a) => {
        for (let j = i + 1; j < a.length; j++) {
          if (!isOverlapping(v.box, a[j].box)) continue
          Object.keys(v.containers).forEach(k => {
            if (k in a[j].containers) a[j].remove(k)
          })
        }
      })
    },

    /**
     * update cache content of that container
     * @param {string | Pos3DLike} pos 
     * @param {Inventory<any>} inv 
     * @param {string} group 
     */
    async update(pos, inv, group) {
      for (const cchunk of storages[group])
        if (await cchunk.update(pos, inv)) break
    },

    // /**
    //  * 
    //  * @param {string} group 
    //  * @param {string} id 
    //  * @returns distance sorted
    //  */
    // find(group, id) {
    //   const pos = Player.getPlayer().getPos()
    //   util.debug.log?.(`[storage] finding item ${id} in ${group}`)
    //   return storages[group]
    //     .flatMap(g => g.find(id))
    //     .sort((a, b) =>
    //       pos.toVector(a.pos).getMagnitudeSq() -
    //       pos.toVector(b.pos).getMagnitudeSq()
    //     )
    // },

    // /**
    //  * 
    //  * @param {string} group 
    //  * @returns distance sorted
    //  */
    // findEmpty(group) {
    //   const pos = Player.getPlayer().getPos()
    //   util.debug.log?.(`[storage] finding empty chest ${id} in ${group}`)
    //   return storages[group]
    //     .flatMap(g => g.empty)
    //     .map(toPos3D)
    //     .sort((a, b) =>
    //       pos.toVector(a).getMagnitudeSq() -
    //       pos.toVector(b).getMagnitudeSq()
    //     )
    // },

    /**
     * 
     * @param {string} group 
     * @returns {Dict} total items in this group
     */
    totalItems(group) {
      if (!(group in storages)) return {}
      const list = storages[group].map(g => g.total)
      const last = list.pop()
      if (!last) return {}
      return list.reduce((p, v) => util.dict.add(p, v), util.dict.clone(last))
    },

    /**
     * operate items in group  
     * try to match inventory item counts to {@link items}
     * @param {string} group 
     * @param {Dict} items 
     * @param {boolean} clear should clear other items or not
     */
    async operate(group, items, clear = false) {
      for (const chunk of storages[group]) {
        if (await chunk.operate(items, clear)) return true
      }
      return false
    }

  }

  /**
   * check if the vec3d has half chest with condition
   * @param {Vec3D} vec 
   * @param {'north' | 'south' | 'west' | 'east'} facL 
   * @param {'north' | 'south' | 'west' | 'east'} facR 
   * @returns 
   */
  function scanHalfChest(vec, facL, facR) {
    for (let y = vec.y1; y <= vec.y2; y++)
    for (let z = vec.z1; z <= vec.z2; z++)
    for (let x = vec.x1; x <= vec.x2; x++) {
      const block = World.getBlock(x, y, z)
      if (block.getId() !== 'minecraft:chest') continue
      const state = block.getBlockState()
      if ((state.facing === facR && state.half === 'right') ||
          (state.facing === facL && state.half === 'left')) return true
    }
    return false
  }
  
  /**
   * convert to 'x,y,z' format
   * @param {string | Pos3DLike} pos 
   * @param {number} yoffset
   */
  function toStrPos(pos, yoffset = 0) {
    if (typeof pos === 'string')
    if (yoffset === 0) return pos
    else pos = toPos3D(pos)
    pos = util.toPos(pos)
    return `${pos.x},${pos.y + yoffset},${pos.z}`
  }
  
  /**
   * convert to Pos3D
   * @param {string} str 
   * @returns {Pos3D}
   */
  function toPos3D(str) {
    return util.Pos(...str.split(',').map(v => +v))
  }

  /**
   * 
   * @param {Vec3D} vec1 
   * @param {Vec3D} vec2 
   */
  function isOverlapping(vec1, vec2) {
    return (
      ((vec2.x1 <= vec1.x2 && vec2.x1 >= vec1.x1) || (vec2.x2 <= vec1.x2 && vec2.x2 >= vec1.x1)) &&
      ((vec2.y1 <= vec1.y2 && vec2.y1 >= vec1.y1) || (vec2.y2 <= vec1.y2 && vec2.y2 >= vec1.y1)) &&
      ((vec2.z1 <= vec1.z2 && vec2.z1 >= vec1.z1) || (vec2.z2 <= vec1.z2 && vec2.z2 >= vec1.z1)))
  }

}
