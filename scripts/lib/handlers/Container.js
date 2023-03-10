
/**
 * @typedef {{ [id: string]: number }} dict
 * @typedef {_javatypes.xyz.wagyourtail.jsmacros.client.api.classes.Inventory<any>} Inventory
 * @typedef {_javatypes.xyz.wagyourtail.jsmacros.client.api.sharedclasses.PositionCommon$Pos3D} Pos3D
 */

/** @param {import('../util')} util */
module.exports = util => {
  if (!util?.toJava) new Error('util needed')
  util.movement

  /** @type {string[][]} */
  const ClickPathCache = require('./ClickPathTable.json')
  const Click = {
    leftA:  'A',
    leftB:  'B',
    rightA: 'a',
    rightB: 'b'
  }
  
  let lastIntervalTime = 0, interval = 2
  let invMapCache = {}

  return {

    /**
     * try to point at container
     */
    humanLike: false,

    /**
     * interval between inventory interacts
     */
    get interval() {
      return interval
    },
    set interval(ticks) {
      if (typeof ticks === 'number') interval = ticks
    },

    quickInterval: false,

    /**
     * shulker machine handler
     * @readonly
     */
    get shulkerMachine() {
      const value = require('./ShulkerMachine')(util)
      Object.defineProperty(this, 'shulkerMachine', { value })
      return value
    },

    /**
     * shulker macro handler
     * @readonly
     */
    get shulkerMacro() {
      const value = require('./ShulkerMacro')(util)
      Object.defineProperty(this, 'shulkerMacro', { value })
      return value
    },

    /**
     * open container and operate items  
     * try to match inventory item counts to {@link items}
     * @param {Pos3D|number[]|Inventory} chest 
     * @param {dict} items 
     * @returns success
     */
    async operate(chest, items) {
      if (Object.keys(items).length === 0) return true
      const inv = 'click' in chest ? chest : await this.waitGUI(chest)
      if (!inv) return false
      const CSlots = this.getContainerSlots(inv)
      const ISlots = this.getInventorySlots(inv)
      let res = true
      for (const id in items)
        if (!(await this.operateItem(inv, id, items[id], CSlots, ISlots))) res = false
      return res
    },

    /**
     * make item count in inventory matches {@link count}
     * @param {Inventory} inv 
     * @param {string} id 
     * @param {number} count 
     * @param {?number[]} CSlots
     * @param {?number[]} ISlots
     * @returns success
     */
    async operateItem(inv, id, count, CSlots, ISlots) {
      id = completeId(id)
      CSlots ??= this.getContainerSlots(inv)
      ISlots ??= this.getInventorySlots(inv)
      let need = count - this.countItemInInventory(inv, id)
      if (need === 0) return true
      for (const slot of CSlots) {
        if (need <= 0) break
        if (inv.getSlot(slot)?.getItemId() !== id) continue
        need -= inv.getSlot(slot).getCount()
        await this.waitQuickInterval()
        inv.quick(slot)
        if (inv.getSlot(slot)?.getCount()) break
      }
      need = count - this.countItemInInventory(inv, id)
      for (const slot of ISlots) {
        if (need >= 0) break
        if (inv.getSlot(slot)?.getItemId() !== id) continue
        if (inv.getSlot(slot).getCount() + need > 0) {
          const s = await this.precisePick(inv, slot, -need)
          await this.waitQuickInterval()
          inv.quick(s)
          break
        }
        need += inv.getSlot(slot).getCount()
        await this.waitQuickInterval()
        inv.quick(slot)
        if (inv.getSlot(slot)?.getCount()) break
      }
      return count - this.countItemInInventory(inv, id) <= 0
    },

    /**
     * precisly make the count of item on {@link slot} to {@link count}
     * @param {Inventory} inv 
     * @param {number} slot 
     * @param {number} count 
     */
    async precisePick(inv, slot, count) {
      const temp = this.getEmptySlotInInventory(inv)
      let current = inv.getSlot(slot).getCount()
      if (!temp) {
        if (count >= Math.floor(current / 2)) {
          await this.waitInterval()
          inv.click(slot, 1)
          current = Math.floor(current / 2)
        }
        while (current < count) {
          await this.waitInterval()
          inv.click(slot, 1)
          if (count - current < 8) await util.waitTick(3)
          if (current >= count) await util.waitTick(interval)
        }
        if (current === count) {
          await this.waitInterval()
          inv.quick(slot)
          return slot
        }
        else {
          await this.waitInterval()
          inv.click(slot)
          return await this.precisePick(inv, slot, count)
        }
      }else {
        const path = ClickPathCache[current - 2][count - 1]
        outer:
        for (const action of path) switch (action) {
          case Click.leftA:
            await this.waitInterval()
            inv.click(slot)
            break
          case Click.leftB:
            await this.waitInterval()
            inv.click(temp)
            break
          case Click.rightA:
            await this.waitInterval()
            inv.click(slot, 1)
            break
          case Click.rightB:
            await this.waitInterval()
            inv.click(temp, 1)
            break
          default:
            break outer
        }
        await util.waitTick()
        return path.endsWith('@a') ? slot : temp
      }
    },

    /**
     * check if the inv has items
     * @param {Inventory} inv 
     * @param {dict} items 
     * @param {?number[]} slots default hotbar + crafting_out + main, will cache
     */
    has(inv, items, slots) {
      if (!Array.isArray(slots))
        slots = invMapCache[inv.getType()] ??= Java.from(inv.getMap().hotbar)
          .concat(inv.getMap().output ?? inv.getMap().crafting_out ?? [])
          .concat(inv.getMap().main ?? []).reverse()
      items = util.dict.clone(items)
      Object.keys(items).forEach(k => {
        if (typeof items[k] !== 'number' || !(items[k] > 0)) delete items[k]
      })
      let item, id
      for (const s of slots) {
        item = inv.getSlot(s)
        id = item.getItemId()
        if (!(id in items)) continue
        items[id] -= item.getCount()
        if (!(items[id] > 0)) {
          delete items[id]
          if (Object.values(items).every(v => !(v > 0))) return true
        }
      }
      return false
    },

    /**
     * 
     * @param {Inventory} inv 
     * @param {string} id 
     * @returns {number}
     */
    countItemInInventory(inv, id) {
      id = completeId(id)
      return this.getInventorySlots(inv)
        .reduce((p, i) => (i = inv.getSlot(i))?.getItemId() === id ? p + i.getCount() : p, 0)
    },

    /**
     * 
     * @param {Inventory} inv 
     * @returns {number[]}
     */
    getInventorySlots(inv) {
      return Java.from(inv.getMap().main).concat(inv.getMap().hotbar)
    },

    /**
     * 
     * @param {Inventory} inv 
     * @returns {number[]}
     */
    getContainerSlots(inv) {
      return Java.from(inv.getMap().container)
    },

    /**
     * 
     * @param {Inventory} inv 
     */
    getEmptySlotInInventory(inv) {
      return this.getInventorySlots(inv).find(s => inv.getSlot(s).isEmpty())
    },

    /**
     * get slots needed based on items count
     * @param {dict} items 
     */
    calculateSlots(items) {
      let slots = 0
      Object.keys(items).forEach(id => slots += Math.ceil(items[id] / util.getMaxCount(id)))
      return slots
    },

    /**
     * i thought shift double click with holding item is handled by another action  
     * realized i'm wrong, and understood why it's safe to chain without wait
     * @param {?() => void} cb 
     */
    async waitQuickInterval(cb) {
      return !this.quickInterval ? cb?.(null) : await this.waitInterval(cb)
    },

    /**
     * await this before inventory operations
     * @param {?() => void} cb
     */
    async waitInterval(cb) {
      lastIntervalTime = Math.max(util.ticks, lastIntervalTime) + interval
      await util.waitTick(Math.floor(lastIntervalTime - util.ticks))
      return cb?.(null)
    },

    /**
     * wait for a container gui
     * @param {number[]|Pos3D} coords 
     * @param {number} timeout 
     * @returns {Promise<Inventory|null>}
     */
    async waitGUI(coords, timeout = 300) {
      if (coords.x != null) coords = [coords.x, coords.y, coords.z]
      else coords.length = 3
      if (Hud.isContainer()) Player.openInventory().close()
      if (!(await util.movement.simpleWalkReach(coords))) return null
      if (this.humanLike) await util.lookAt(...coords.map(v => v + 0.5))
      Player.getPlayer().interactBlock(...coords, 0, false)
      let wfe, wfe2
      const start = util.ticks
      await new Promise(res => {
        wfe = util.waitForEvent(
          'BlockUpdate', // for short circuit, since some chest is stuck or locked
          e => e.block.getX() === coords[0] &&
               e.block.getY() === coords[1] &&
               e.block.getZ() === coords[2],
          () => util.waitTick((util.ticks - start) * 5 + 4, res),
          timeout
        )
        util.waitTick(timeout, res)
        wfe2 = util.waitForEvent('OpenScreen', () => Hud.isContainer(), res, timeout)
      })
      wfe?.cancel()
      wfe2?.cancel()
      if (Hud.isContainer()) {
        const inv = Player.openInventory()
        await this.waitInterval()
        if (!('container' in inv.getMap())) return inv
        const last = Java.from(inv.getMap().container).at(-1)
        if (!inv.getSlot(last).isEmpty()) return inv
        await util.waitTick()
        if (!inv.getSlot(last).isEmpty()) return inv
        await util.waitTick()
        return inv
      }else return null
    }
  }
}

function completeId(id = 'air') {
  return id.includes(':') ? id : 'minecraft:' + id
}
