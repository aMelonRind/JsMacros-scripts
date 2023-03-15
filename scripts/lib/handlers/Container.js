
// util.container

const Inventory = Java.type('xyz.wagyourtail.jsmacros.client.api.classes.Inventory')

const asyncMethods = [
  'swap',
  'click',
  'quick',
  'split',
  'grabAll',
  'dropSlot',
  'dragClick',
  'swapHotbar'
]

/** @type {string[][]} */
const ClickPathCache = require('./ClickPathTable.json')
const Click = {
  leftA:  'A',
  leftB:  'B',
  rightA: 'a',
  rightB: 'b'
}

/**
 * @param {import('../util')} util
 * @returns {ContainerHandler}
 */
module.exports = util => {
  /** @typedef {_&modu} ContainerHandler */
  if (!util?.toJava) new Error('util needed')
  util.movement

  let safetyDelay
  let lastIntervalTime = 0, interval = 2, hasInterval = true
  let invMapCache = {}

  const modu = {

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
      if (typeof ticks !== 'number') return
      interval = ticks
      hasInterval = !!(ticks > 0)
    },

    quickInterval: false,

    /** @readonly */ // should i move this to util.storage?
    get shulkerMacro() {
      const value = require('./ShulkerMacro')(util)
      Object.defineProperty(this, 'shulkerMacro', { value })
      return value
    },

    /**
     * open container and operate items  
     * try to match inventory item counts to {@link items}
     * @param {Pos3DLike | Inventory<any>} chest 
     * @param {Dict} items 
     * @returns success
     */
    async operate(chest, items) {
      if (Object.keys(items).length === 0) return true
      const inv = chest instanceof Inventory ? chest : await this.waitGUI(util.toPos(chest))
      if (!(inv instanceof Inventory)) return false
      const CSlots = this.getContainerSlots(inv)
      const ISlots = this.getInventorySlots(inv)
      let res = true
      for (const id in items)
        if (!(await this.operateItem(inv, id, items[id], CSlots, ISlots))) res = false
      return res
    },

    /**
     * make item count in inventory matches {@link count}
     * @param {AsyncInventory} inv 
     * @param {string} id 
     * @param {number} count 
     * @param {number[]} [CSlots]
     * @param {number[]} [ISlots]
     * @returns success
     */
    async operateItem(inv, id, count, CSlots, ISlots) {
      id = util.completeId(id)
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
          await this.precisePick(inv, slot, inv.getSlot(slot).getCount() + need)
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
     * will quick the remainder
     * @param {AsyncInventory} inv 
     * @param {number} slot 
     * @param {number} count 
     * @returns {Promise<number>} the result slot
     */
    async precisePick(inv, slot, count) {
      const temp = this.getEmptySlotInInventory(inv)
      let current = inv.getSlot(slot).getCount()
      if (current <= count) return slot
      if (!temp) {
        // change to remainder since there's only one slot
        count = current - count
        if (count >= Math.floor(current / 2)) {
          await inv.click(slot, 1)
          current = Math.floor(current / 2)
        }
        while (current < count) {
          await inv.click(slot, 1)
          if (count - current < 8) await util.waitTick(3)
          if (current >= count) await util.waitTick(interval)
        }
        if (current === count) {
          await inv.quick(slot)
          if (!inv.getSlot(slot).isEmpty()) util.throw(`slot is still occupied (${slot})`)
          await inv.click(slot)
          return slot
        }
        else {
          await inv.click(slot)
          return await this.precisePick(inv, slot, count)
        }
      }else {
        const path = ClickPathCache[current - 2][count - 1]
        let action
        for (action of path) switch (action) {
          case Click.leftA:
            await inv.click(slot)
            break
          case Click.leftB:
            await inv.click(temp)
            break
          case Click.rightA:
            await inv.click(slot, 1)
            break
          case Click.rightB:
            await inv.click(temp, 1)
            break
          case '@':
            await this.waitInterval()
            await inv.quick(path.endsWith('@b') ? slot : temp)
            await util.waitTick()
            return    path.endsWith('@a') ? slot : temp
          default:
            util.throw(`unknown path char ${action}`)
        }
      }
    },

    /**
     * check if the inv has items
     * @param {InfoInventory | AsyncInventory | Inventory<any>} inv 
     * @param {Dict} items 
     * @param {number[]} [slots] default hotbar + crafting_out + main, will cache
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
     * @param {InfoInventory | AsyncInventory | Inventory<any>} inv 
     * @param {string} id 
     * @returns {number}
     */
    countItemInInventory(inv, id) {
      id = util.completeId(id)
      return this.getInventorySlots(inv)
        .reduce((p, i) => (i = inv.getSlot(i))?.getItemId() === id ? p + i.getCount() : p, 0)
    },

    /**
     * 
     * @param {InfoInventory | AsyncInventory | Inventory<any>} inv 
     * @returns {number[]}
     */
    getInventorySlots(inv) {
      return Java.from(inv.getMap().hotbar).concat(inv.getMap().main ?? [])
    },

    /**
     * 
     * @param {InfoInventory | AsyncInventory | Inventory<any>} inv 
     * @returns {number[]}
     */
    getContainerSlots(inv) {
      return Java.from(inv.getMap().container)
    },

    /**
     * 
     * @param {InfoInventory | AsyncInventory | Inventory<any>} inv 
     */
    getEmptySlotInInventory(inv) {
      return this.getInventorySlots(inv).reverse().find(s => inv.getSlot(s).isEmpty())
    },

    /**
     * get slots needed based on items count
     * @param {Dict} items 
     */
    calculateSlots(items) {
      let slots = 0
      Object.keys(items).forEach(id => slots += Math.ceil(items[id] / util.getMaxCount(id)))
      return slots
    },

    /**
     * i thought shift double click with holding item is handled by another action  
     * realized i'm wrong, and understood why it's safe to chain without wait
     * @param {() => void} [cb] 
     */
    async waitQuickInterval(cb) {
      return this.quickInterval ? await this.waitInterval(cb) : cb?.(null)
    },

    /**
     * await this before inventory operations
     * @template R
     * @param {() => R} [cb] 
     */
    async waitInterval(cb) {
      if (!hasInterval) return cb?.(null)
      lastIntervalTime = Math.max(util.ticks, lastIntervalTime) + interval
      await util.waitTick(Math.floor(lastIntervalTime - util.ticks))
      return cb?.(null)
    },

    /**
     * wait for a container gui
     * @param {Pos3DLike | string} [pos] Pos3D for container, string for command gui, null/undefined is other
     * @param {number} timeout 
     * @param {boolean} safety for command gui, if your script need high freq command gui opening,
     * set this to false
     * @returns {Promise<?AsyncInventory>}
     */
    async waitGUI(pos, timeout = 300, safety = true) {
      if (pos) if (typeof pos === 'string') {
        if (Hud.isContainer()) Player.openInventory().close()
        if (safety) await safetyDelay
        safetyDelay = util.waitTick(12)
        Chat.say(pos)
      }else {
        pos = util.toPos(pos)
        if (Hud.isContainer()) Player.openInventory().close()
        if (!(await util.movement.walkReach(pos))) return null
        if (this.humanLike) await util.lookAt(...pos.add(0.5, 0.5, 0.5))
        Player.getPlayer().interactBlock(pos.x, pos.y, pos.z, 0, false)
      }
      let wfe, wfe2
      const start = util.ticks
      await new Promise(res => {
        wfe = util.waitForEvent(
          'BlockUpdate', // for short circuit, since some chest is stuck or locked
          e => e.block.getX() === pos.x &&
               e.block.getY() === pos.y &&
               e.block.getZ() === pos.z,
          () => util.waitTick((util.ticks - start) * 5 + 4, res),
          timeout
        )
        util.waitTick(timeout, res)
        wfe2 = util.waitForEvent('OpenScreen', () => Hud.isContainer(), res, timeout)
      })
      wfe?.cancel()
      wfe2?.cancel()
      if (Hud.isContainer()) {
        const inv = this.openInventory()
        await this.waitInterval()
        if (!('container' in inv.getMap())) return inv
        const last = Java.from(inv.getMap().container).at(-1)
        if (!inv.getSlot(last).isEmpty()) return inv
        await util.waitTick()
        if (!inv.getSlot(last).isEmpty()) return inv
        await util.waitTick()
        return inv
      }else return null
    },

    /**
     * open an inventory proxy that can await at some method
     * @returns {AsyncInventory}
     */
    openInventory() {
      return new Proxy(Player.openInventory(), {
        get(raw, key, proxy) {
          if (key === 'raw' || key === 'sync') return raw
          if (key === 'waitInterval') return util.container.waitInterval
          return asyncMethods.includes(key) ? async (...args) => {
            if (util.container.quickInterval || key !== 'quick')
              await util.container.waitInterval()
            const res = raw[key](...args)
            return res === raw ? proxy : res
          } : raw[key]
        }
      })
    }
  }

  return modu
}
