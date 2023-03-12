
/**
 * util.crafting
 *
 * doesn't support complex recipe
 * doesn't support won't-consume ingredients
 */

/** @typedef {import('./type/myTypes')} */

/** @param {Util} util */
module.exports = util => {
  if (!util?.toJava) throw new Error('util needed')
  util.container
  util.storage

  class RecipeHandler {
    
    /**
     * 
     * @param {Recipe[]} recipes 
     * @param {string[]} outputs 
     */
    constructor(recipes, outputs) {
      this.outputs = outputs.map(util.completeId)
      /** @type {Recipe[]} */
      this.recipes = recipes.map((r, i) => {
        util.completeIdKey(r.info.input)
        r.info.output = util.completeId(r.info.output)
        if (r.ingredients) util.completeIdKey(r.ingredients)
        if (r.id) r.id = util.completeId(r.id)

        // max inventory calculate and mark it if it's becoming more
        /** @readonly color please */
        let inputStacks = 0
        for (const key in r.info.input)
              inputStacks += r.info.input[key] / util.getMaxCount(key)
        const outputStacks = r.info.count      / util.getMaxCount(r.info.output)
        let inputRes = Math.ceil(36 / inputStacks)
        while (util.container.calculateSlots(
          util.dict.mul(util.dict.clone(r.info.input), inputRes)) > 36) inputRes--
        r.maxEachTime = Math.floor(Math.min(inputRes, Math.floor(36 / outputStacks)))
        if (outputStacks > inputStacks) r.more = true
        util.completeIdKey(r.weight ??= {})
        for (const id in r.weight) {
          r.weight[id] = util.math.clamp(r.weight[id])
          if (!(r.weight[id] > 0 && r.weight[id] <= 1))
            util.throw(`incorrect weight for ${id} in [${i}] (${r.weight[id]})`)
          if (r.weight[id] === 1) {
            delete r.weight[id]
            continue
          }
          r.weight[id] = 1 - r.weight[id]
        }
        return r
      })
    }

    /**
     * get recipe perform times from items using divider
     * @param {Dict} items 
     * @returns {{ performTimes: { [index: number]: number }, results: Dict }}
     */
    calculate(items) {
      const res = {
        performTimes: {},
        results: {}
      }
      /** @readonly color please */
      let reserved, times
      this.recipes.forEach((r, i) => {
        // reserve items for weights
        reserved = {}
        times = (items[r.info.output] ?? 0) / r.info.count
        for (const id in r.weight) {
          if (!(id in items)) continue
          reserved[id] = Math.ceil((items[id] + (r.info.input[id] ?? 0) * times) * r.weight[id])
          items[id] -= reserved[id]
        }
        // get the largest amount
        times = util.dict.mod(items, r.info.input)
        // add reserved back to items
        util.dict.add(items, reserved)
        if (!(times > 0)) return
        res.performTimes[i] = times
        items[r.info.output] ??= 0
        items[r.info.output] += times * r.info.count
      })
      this.recipes.reduceRight((_, r, i) => { // works like reversed forEach
        if (this.outputs.includes(r.info.output)) return
        if (!res.performTimes[i] || !items[r.info.output]) return
        times = Math.min(res.performTimes[i], Math.floor(items[r.info.output] / r.info.count))
        // undo unnecessary crafts
        if (!(times > 0)) return
        if (!(res.performTimes[i] -= times)) delete res.performTimes[i]
        items[r.info.output] -= times * r.info.count
        util.dict.add(items, util.dict.mul(util.dict.clone(r.info.input), times))
      }, null)
      this.outputs.forEach(id => {
        res.results[id] = items[id] ?? 0
      })
      return res
    }

  }

  return {

    RecipeHandler,

    /** @type {?RecipeHandler} */
    _handler: undefined,

    /** @type {?{ [index: number]: number }} */
    _result: undefined,

    /**
     * @type {?{
     *  performTimes: { [index: number]: number },
     *  results: { [id: string]: number }
     * }}
     */
    res: undefined,

    loadRecipes(recipes, outputs) {
      this._handler = new RecipeHandler(recipes, outputs)
      util.debug.log?.(`[crafting] loaded Recipes: ${JSON.stringify(this._handler.recipes)}`)
      return this
    },

    calculate(items) {
      if (!this._handler) util.throw('no recipes')
      return this.res = this._handler.calculate(items)
    },

    /**
     * execute crafting process
     * @param {{
     *  group: string,
     *  getTotal: ?() => Dict,
     *  operate: ?(items: Dict) => Promise }} input 
     * @param {{ [id: string]: {
     *  group: string,
     *  getTotal: ?() => Dict,
     *  operate: ?(items: Dict) => Promise } }} output 
     * @param {Pos3D[]} craftingTables
     * @param {Pos3D} dump NOT TRASH CHEST!
     */
    async exec(input, output, craftingTables, dump) {
      if (typeof input === 'string') input = { group: input }
      for (const k in output) if (typeof output[k] === 'string') output[k] = { group: output[k] }

      if (!(input.getTotal && input.operate) && !(input.group in util.storage.storages))
        util.throw(`storage group ${input.group} not exist`)

      for (const item in output) if (!this._handler.outputs.includes(item)) delete output[item]
      for (const item of this._handler.outputs) if (!(item in output))
        util.throw(`did't provide output for ${item}`)
      for (const outputGroup of Object.values(output)
        .filter(v => !(v.getTotal && v.operate)).map(v => v.group))
      if (!(outputGroup in util.storage.storages)) util.throw(`storage group ${outputGroup} not exist`)

      input.getTotal ??= () => util.storage.totalItems(input.group)
      this.calculate(input.getTotal())
      if (util.dict.isEmpty(this.res.performTimes)) {
        util.debug.log?.('[crafting] nothing to craft')
        return
      }

      input.operate ??= async (items, clear) => await util.storage.operate(input.group, items, clear)
      for (const k in output) {
        output[k].operate ??= async items => await util.storage.operate(output[k].group, items)
        output[k].getTotal ??= () => util.storage.totalItems(output[k].group)
      }
      
      /** @type {{ [chestSlot: number]: number }} */
      const dumpInv = {}
      /** @type {{ [chestSlot: number]: number }} */
      const dumpHotbar = {}
      if (Hud.isContainer()) Player.openInventory().close()
      const inv = Player.openInventory()
      if (Java.from(inv.getMap().main).concat(inv.getMap().hotbar).some(s => !inv.getSlot(s).isEmpty())) {
        util.debug.log?.('[crafting] dumping inventory')
        const inv = await util.container.waitGUI(dump)
        if (!inv || !inv.getMap().container) util.throw("can't open dump chest")
        dumpInv.total = inv.getTotalSlots()
        const invSlots   = Java.from(inv.getMap().main).concat(inv.getMap().hotbar)
        const chestSlots = Java.from(inv.getMap().container)
        const invItems   = invSlots  .map(s => !inv.getSlot(s).isEmpty())
        const chestAirs  = chestSlots.map(s =>  inv.getSlot(s).isEmpty())
        if (chestAirs.filter(v => v).length < invItems.filter(v => v).length)
          util.throw('not enough dump chest space')
        // if space is enough, dump prettier
        const itemRows  = new Array(Math.ceil (invItems.length / 9)).fill()
          .map((_, i) => invItems.slice(i * 9, i * 9 + 9).some(v => v))
        const chestRows = new Array(Math.floor(chestAirs.length / 9)).fill()
          .map((_, i) => invItems.slice(i * 9, i * 9 + 9).every(v => !v))
        for (const [row, hasItem] of Object.entries(itemRows).reverse()) {
          if (!hasItem) continue
          if (chestRows.every(r => !r)) break
          const toRow = chestRows.lastIndexOf(true) * 9
          invItems.slice(row * 9, row * 9 + 9).forEach((s, i) => {
            if (!s) return
            dumpInv[chestSlots[toRow + i]] = invSlots[row * 9 + i]
            invItems[row * 9 + i] = false
            chestAirs[toRow  + i] = false
          })
          chestRows[toRow / 9] = false
        }
        if (itemRows.some(v => v)) {
          // not all dumped, ugly dumping
          const chestAirLeft = chestAirs.map(((v, i) => v ? chestSlots[i] : null))
            .filter(v => v != null).reverse()
          invItems.forEach((v, i) => {
            if (v) dumpInv[chestAirLeft.pop()] = invSlots[i]
          })
        }
        const hotbar = Java.from(inv.getMap().hotbar)
        Object.keys(dumpInv).forEach(k => {
          if (hotbar.includes(dumpInv[k])) {
            dumpHotbar[k] = hotbar.indexOf(dumpInv[k])
            delete dumpInv[k]
          }
        })
        // dump, hotbar first
        for (const cSlot in dumpHotbar) {
          await util.container.waitInterval()
          inv.swapHotbar(+cSlot, dumpHotbar[cSlot])
        }
        for (const cSlot in dumpInv) {
          if (cSlot === 'total') continue
          await util.container.waitInterval()
          inv.swapHotbar(dumpInv[cSlot], 0)
          await util.container.waitInterval()
          inv.swapHotbar(+cSlot, 0)
        }
        await util.waitTick()
      }
      util.debug.log?.('[crafting] start crafting')
      while (true) {
        util.debug.log?.('[crafting] looping')
        // find recipe that's able to craft
        const currentItems = util.dict.add(util.dict.fromInv(), input.getTotal())
        this.calculate(util.dict.clone(currentItems))
        if (util.dict.isEmpty(this.res.performTimes)) break
        const recipei = Object.keys(this.res.performTimes)
          .sort(ari => this._handler.recipes[ari].more ? 1 : -1)
          .find(ri => util.dict.isLessOrEqualThan(this._handler.recipes[ri].info.input, currentItems))
        if (recipei == null) util.throw(`error finding recipe to craft (${
          JSON.stringify(this._handler.recipes.map(r => r.info.input))}) (${JSON.stringify(currentItems)})`)
        const recipe = this._handler.recipes[recipei]
        const times = Math.min(util.dict.mod(currentItems, recipe.info.input),
          recipe.maxEachTime, this.res.performTimes[recipei])
        if (times <= 0) util.throw(`times <= 0 (${times})`)
        this.res.performTimes[recipei] -= times
        if (this.res.performTimes[recipei] === 0) delete this.res.performTimes[recipei]
        // call input.operate
        if (!(await input.operate(util.dict.mul(util.dict.clone(recipe.info.input), times), true))) {
          util.debug.log?.("[crafting] can't operate items, continue loop")
          continue
        }
        // find crafting table and call this.recipeBookCraft or macro(not implemented)
        const inv = Hud.getOpenScreenName() === 'Crafting Table' ?
          Player.openInventory() :
          await util.container.waitGUI(util.math.nearest(craftingTables))
        if (!inv) util.throw("can't open crafting table")
        switch (recipe.type) {
          case 'recipe_book':
            await this.recipeBookCraft(inv, recipe.id, recipe.info.input)
            break
          case 'macro':
            util.throw('not yet implemented')
            break
        }
        // if contains output call output.operate to store
        const items = util.dict.fromInv()
        for (const id in output) {
          if (id in items) if (!(await output[id].operate({ [id]: 0 }))) {
            util.debug.log?.(`can't put output items, dump to input (${id})`)
            await input.operate({ [id]: 0 })
          }
        }
        // continue
      }
      if (dumpInv.total) {
        util.debug.log?.('[crafting] getting inventory')
        const inv = await util.container.waitGUI(dump)
        if (!inv || !inv.getMap().container) util.throw("can't open dump chest")
        if (dumpInv.total !== inv.getTotalSlots())
          util.throw(`slots doesn't match (${dumpInv.total}) (${inv.getTotalSlots()})`)
        for (const cSlot in dumpInv) {
          if (cSlot === 'total') continue
          await util.container.waitInterval()
          inv.swapHotbar(+cSlot, 0)
          await util.container.waitInterval()
          inv.swapHotbar(dumpInv[cSlot], 0)
        }
        for (const cSlot in dumpHotbar) {
          await util.container.waitInterval()
          inv.swapHotbar(+cSlot, dumpHotbar[cSlot])
        }
      }
      util.debug.log?.('[crafting] done')
    },

    /**
     * 
     * @param {Inventory<any>} inv 
     * @param {string} id 
     * @param {Dict} inputInfo 
     * @returns 
     */
    async recipeBookCraft(inv, id, inputInfo) {
      for (let i = 0; i < 60; i++) {
        if (!Hud.isContainer() || !util.container.has(inv, inputInfo)) return
        if (Java.from(inv.getCraftableRecipes()).find(r => r.getId() === id)) break
        await util.waitTick()
      }
      if (!Java.from(inv.getCraftableRecipes()).find(r => r.getId() === id)) return
      const output = Java.from(inv.getMap().output ?? inv.getMap().crafting_out)[0]
      outer:
      while (true) {
        /** @type {?_javatypes.xyz.wagyourtail.jsmacros.client.api.helpers.RecipeHelper} */
        let recipe
        for (let i = 0; i < 200; i++) {
          recipe = undefined
          for (let i = 0; i < 5; i++) {
            if (!Hud.isContainer() || !util.container.has(inv, inputInfo)) return
            recipe = Java.from(inv.getCraftableRecipes()).find(r => r.getId() === id)
            if (recipe) break
            await util.waitTick()
          }
          if (!recipe) return
          if (!(i % 20)) {
            await util.container.waitInterval()
            recipe.craft(true)
            await util.waitTick()
          }
          if (!inv.getSlot(output).isEmpty()) {
            await util.container.waitInterval()
            inv.quick(output)
            await util.container.waitInterval()
            continue outer
          }
        }
        return
      }
    }

  }

}