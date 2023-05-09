/** @author MelonRind#5202 */

/**
 * history20230305-1203: this module contains complicated recipe parsing
 * the parse isn't neccessary i guess, so i back it up here
 * ====================================================================================
 * doesn't support complex recipe
 * doesn't support won't-consume ingredients
 * @typedef {{ [id: string]: number }} dict
 */

/** @param {import('./util')} util */
module.exports = util => {
  if (!util?.toJava) throw new Error('util needed')
  util.container

  class RecipeHandler {
    
    /**
     * nightmare. don't know how to parse complex recipe route
     * @param {string[]} inputs 
     * @param {string[]} outputs 
     * @param {object[]} recipes 
     */
    constructor(inputs, outputs, recipes) {
      this.inputs  = inputs.map(completeId)
      this.outputs = outputs.map(completeId)
      this.recipes = recipes.slice()
      this.recipes.forEach(r => {
        completeIdKey(r.info.input)
        completeIdKey(r.info.output)
        if (r.ingredients) completeIdKey(r.ingredients)
        if (r.id) r.id = completeId(r.id)
      })
      const has = this.recipes.flatMap(r => Object.keys(r.info.input)).concat(this.inputs)
        .sort().filter((v, i, a) => v !== a[i - 1])
      const need = this.recipes.flatMap(r => Object.keys(r.info.input))
        .sort().filter((v, i, a) => v !== a[i - 1] && !has.includes(v))
      if (need[0]) util.throw(`can't find anyway to get ${need.join(', ')}`)
      /** @type {{ [output: string]: number[] }} */
      this.recipeDict = {}
      this.recipes.forEach((r, i) => {
        const output = Object.keys(r.info.output)[0]
        this.recipeDict[output] ??= []
        this.recipeDict[output].push(i)
      })
      /** @type {{ id: string, items: dict, performTimes: { [i: number]: number }, count: number }[]} */
      this.divider = []
      this.outputs.forEach(id => {
        if (!(id in this.recipeDict)) return util.warn?.(`[crafting] no recipe for ${id}`)
        this.divider.push(...this.recipeDict[id].flatMap(ri => {
          const routes = this._branch(
            id,
            this.recipeDict,
            this.recipes,
            util.dict.clone(this.recipes[ri].info.input),
            [],
            { [ri]: 1 },
            -this.recipes.length * 5,
            Object.values(this.recipes[ri].info.output)[0]
          )
          if (!routes?.length) util.throw(`can't strictly find raw material for ${id}.`)
          return routes
        }))
      })
      this.recipes.forEach(r => {
        // max inventory calculate and mark it if it's becoming more
        const inputStacks = Object.keys(r.info.input)
          .reduce((p, v) => p + r.info.input[v] / util.getMaxCount(v), 0)
        const outputStacks = Object.keys(r.info.output)
          .reduce((p, v) => p + r.info.output[v] / util.getMaxCount(v), 0)
        let inputRes = Math.ceil(36 / inputStacks)
        while (util.container.calculateSlots(
          util.dict.mul(util.dict.clone(r.info.input), inputRes)) > 36) inputRes--
        r.maxEachTime = Math.floor(Math.min(inputRes, Math.floor(36 / outputStacks)))
        if (outputStacks > inputStacks) r.more = true
      })
    }

    /**
     * @param {string} item 
     * @param {{ [output: string]: number[] }} dict 
     * @param {any[]} recipes 
     * @param {{ [id: string]: number }} items 
     * @param {string[]} avoid 
     * @param {{ [index: number]: number }} performTimes 
     * @param {number} iter 
     * @param {number} count
     * @param {{ [id: string]: number }} extra 
     * @param {{ id: string, items: { [id: string]: number }, performTimes: { [i: number]: number }, count: number }[]} res
     */
    _branch(item, dict, recipes, items, avoid, performTimes,
        iter, count = 1, extra = {}, res = []) {
      while (true) {
        iter++
        if (iter > 0) return res
        util.dict.cutExtra(items, this.inputs, extra)
        if (!Object.keys(extra).length) {
          res.push({ id: item, items, performTimes, count })
          return res
        }
        for (const id in extra) {
          avoid.push(id)
          const r = dict[id].filter(i => avoid.every(a => !(a in recipes[i].info.input)))
          if (r.length === 0) return res
          if (r.length > 1) {
            r.forEach(i => {
              const itemsC        = util.dict.clone(items)
              const performTimesC = util.dict.clone(performTimes)
              const extraC        = util.dict.clone(extra)
              const outputCount = Object.values(recipes[i].info.output)[0]
              const cm = util.math.lcm(extra[id], outputCount)
              const multiplier = cm / extra[id]
              util.dict.mul(itemsC,        multiplier)
              util.dict.mul(performTimesC, multiplier)
              util.dict.mul(extraC,        multiplier)
              const countC = count *  multiplier
              delete extraC[id]
              performTimesC[i] ??= 0
              performTimesC[i] += cm / outputCount
              util.dict.add(itemsC, util.dict.mul(util.dict.clone(recipes[i].info.input), cm / outputCount))
              this._branch(item, dict, recipes, itemsC, avoid.slice(), performTimesC, iter, countC, extraC, res)
            })
            return res
          }
          const outputCount = Object.values(recipes[r[0]].info.output)[0]
          const cm = util.math.lcm(extra[id], outputCount)
          util.dict.mul(items,        cm / extra[id])
          util.dict.mul(performTimes, cm / extra[id])
          util.dict.mul(extra,        cm / extra[id])
          delete extra[id]
          performTimes[r] ??= 0
          performTimes[r] += cm / outputCount
          util.dict.add(items, util.dict.mul(util.dict.clone(recipes[r].info.input), cm / outputCount))
        }
      }
    }

    /**
     * get recipe perform times from items using divider
     * @param {dict} items 
     * @returns {{ performTimes: { [index: number]: number }, results: dict }}
     */
    calculate(items) { // todo: undo mid-ingredients
      const res = {
        performTimes: {},
        results: {}
      }
      this.divider.forEach(d => {
        const times = util.dict.mod(items, d.items)
        if (times === 0) return
        util.dict.add(res.performTimes, util.dict.mul(util.dict.clone(d.performTimes), times))
        res.results[d.id] ??= 0
        res.results[d.id] += d.count * times
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

    loadRecipes(inputs, outputs, recipes) {
      this._handler = new RecipeHandler(inputs, outputs, recipes)
      util.debug.log?.(`[crafting] loaded Recipes: ${JSON.stringify(this._handler.recipes)}`)
      return this
    },

    calculate(items) {
      if (!this._handler) util.throw('no recipes')
      return this._handler.calculate(items)
    },

    /**
     * execute crafting process
     * @param {{
     *  group: string,
     *  getTotal: ?() => dict,
     *  operate: ?(items: dict) => Promise }} input 
     * @param {{ [id: string]: {
     *  group: string,
     *  getTotal: ?() => dict,
     *  operate: ?(items: dict) => Promise } }} output 
     * @param {boolean} dynamicInput
     * @param {Pos3D[]} craftingTables
     * @param {Pos3D} dump NOT TRASH CHEST!
     */
    async exec(input, output, dynamicInput = false, craftingTables, dump) {
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
      let res = this._handler.calculate(input.getTotal())
      if (!Object.keys(res.performTimes)[0]) {
        util.debug.log?.('[crafting] nothing to craft')
        return
      }

      input.operate ??= async items => await util.storage.operate(input.group, items)
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
      }
      util.debug.log?.('[crafting] start crafting')
      while (!util.dict.isEmpty(res.performTimes)) {
        util.debug.log?.('[crafting] looping')
        // find recipe that's able to craft
        const currentItems = util.dict.add(util.dict.fromInv(), input.getTotal())
        if (dynamicInput) res = this._handler.calculate(currentItems)
        const recipei = Object.keys(res.performTimes)
          .sort(ari => this._handler.recipes[ari].more ? 1 : -1)
          .find(ri => util.dict.isLessOrEqualThan(this._handler.recipes[ri].info.input, currentItems))
        if (recipei == null) util.throw(`error finding recipe to craft (${
          JSON.stringify(this._handler.recipes.map(r => r.info.input))}) (${JSON.stringify(currentItems)})`)
        const recipe = this._handler.recipes[recipei]
        const times = Math.min(util.dict.mod(currentItems, recipe.info.input),
        recipe.maxEachTime, res.performTimes[recipei])
        if (times <= 0) util.throw(`times <= 0 (${times})`)
        res.performTimes[recipei] -= times
        if (res.performTimes[recipei] === 0) delete res.performTimes[recipei]
        // call input.operate
        if (!(await input.operate(util.dict.mul(util.dict.clone(recipe.info.input), times), true))) {
          util.debug.log?.("[crafting] can't operate items, continue loop")
          continue
        }
        // find crafting table and call this.recipeBookCraft or macro(not implemented)
        const inv = recipe.on === 'crafting_inv' ||
          Hud.getOpenScreenName() === 'Crafting Table' ?
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
     * @param {Inventory} inv 
     * @param {string} id 
     * @param {dict} inputInfo 
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

  function completeId(id = 'air') {
    return id.includes(':') ? id : `minecraft:${id}`
  }

  function completeIdKey(obj) {
    for (const k in obj) {
      if (k.includes(':')) continue
      obj[`minecraft:${k}`] = obj[k]
      delete obj[k]
    }
  }

}