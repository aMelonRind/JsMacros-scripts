
/**
 * util.crafting
 *
 * doesn't support complex recipe
 * doesn't support won't-consume ingredients
 */

const util = require('../util')
util.container
util.storage

const airId = 'minecraft:air'

const /** @enum {Crafting.RecipeType} */ RecipeType = {
  /** @readonly @type {'recipe_book'} */ Book: 'recipe_book',
  /** @readonly @type {'macro'}       */ Macro: 'macro'
}

class CraftingHandler {

  Recipe = BaseRecipe
  /** @type {RecipesHandler} */ _handler
  /** @type {Dict<number>} */ _result

  /**
   * @type {{
   *  performTimes: Dict<number>,
   *  results: Dict<ItemId>
   * }=}
   */
  res

  loadRecipes(recipes, outputs) {
    this._handler = new RecipesHandler(recipes, outputs)
    util.debug.log?.(`[crafting] loaded Recipes: ${JSON.stringify(this._handler.recipes)}`)
    return this
  }

  calculate(items) {
    if (!this._handler) util.throw('no recipes')
    return this.res = this._handler.calculate(items)
  }

  /**
   * execute crafting process
   * @param {{
   *  group: string,
   *  getTotal?: () => Dict<ItemId>,
   *  operate?: (items: Dict<ItemId>) => Promise }} input 
   * @param {{ [id: string]: {
   *  group: string,
   *  getTotal?: () => Dict<ItemId>,
   *  operate?: (items: Dict<ItemId>) => Promise } }} output 
   * @param {Pos3DLike[]} craftingTables
   * @param {Pos3DLike} dump NOT TRASH CHEST!
   */
  async exec(input, output, craftingTables, dump) {
    craftingTables = craftingTables.map(util.toPos)
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
    if (inv.getMap().main.concat(inv.getMap().hotbar).some(s => !inv.getSlot(s).isEmpty())) {
      util.debug.log?.('[crafting] dumping inventory')
      const inv = await util.container.waitGUI(dump = util.toPos(dump))
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
      for (const cSlot in dumpHotbar)
        await inv.swapHotbar(+cSlot, dumpHotbar[cSlot])
      for (const cSlot in dumpInv) {
        if (cSlot === 'total') continue
        await inv.swapHotbar(dumpInv[cSlot], 0)
        await inv.swapHotbar(+cSlot, 0)
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
      /** @type {Recipe} */
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
      // find crafting table and call this.recipeBookCraft or this.macroCraft
      const inv = Hud.getOpenScreenName() === 'Crafting Table' ?
        util.container.openInventory() :
        await util.container.waitGUI(util.math.nearest(craftingTables))
      if (!inv) util.throw("can't open crafting table")
      await recipe.craft(inv)
      // if contains output call output.operate to store
      const items = util.dict.fromInv()
      for (const id in output) {
        if (id in items) if (!(await output[id].operate({ [id]: 0 }))) {
          util.debug.log?.(`output error or full (${id})`)
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
        await inv.swapHotbar(+cSlot, 0)
        await inv.swapHotbar(dumpInv[cSlot], 0)
      }
      for (const cSlot in dumpHotbar) {
        await inv.swapHotbar(+cSlot, dumpHotbar[cSlot])
      }
    }
    util.debug.log?.('[crafting] done')
  }

}

class RecipesHandler {

  /** @type {ItemId[]} */ outputs
  /** @type {Recipe[]} */ recipes

  /**
   * 
   * @param {Crafting.json.Recipe[]} recipes 
   * @param {ItemId[]} outputs 
   */
  constructor(recipes, outputs) {
    this.recipes = recipes.map(json => BaseRecipe.parse(json))
    this.outputs = outputs.map(util.completeId)
  }

  /**
   * get recipe perform times from items using divider
   * @param {Dict<ItemId>} items 
   * @returns {{ performTimes: { [index: number]: number }, results: Dict<ItemId> }}
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

class BaseRecipe {

  /** @type {Crafting.json.BaseRecipe['info']} */ info
  /** @type {Crafting.json.BaseRecipe['weight']} */ weight
  /** @type {number} */ maxEachTime
  /** @type {boolean} */ more

  /**
   * parse a json recipe
   * @param {Crafting.json.Recipe} json
   * @returns {Recipe}
   */
  static parse(json) {
    switch (json.type) {
      case RecipeType.Book:
        return BookRecipe.parse(json)
      case RecipeType.Macro:
        return MacroRecipe.parse(json)
      default:
        util.throw(`unknown recipe type (${json.type})`)
    }
  }

  /**
   * @param {Crafting.json.BaseRecipe} json 
   */
  constructor(json) {
    let inputStacks = 0
    for (const key in json.info.input)
          inputStacks += json.info.input[key] / util.getMaxCount(key)
    const outputStacks = json.info.count      / util.getMaxCount(json.info.output)
    let inputRes = Math.ceil(36 / inputStacks)
    while (util.container.calculateSlots(
      util.dict.mul(util.dict.clone(json.info.input), inputRes)) > 36) inputRes--
    this.maxEachTime = Math.floor(Math.min(inputRes, Math.floor(36 / outputStacks)))
    this.more = false
    if (outputStacks > inputStacks) this.more = true
    util.completeIdKey(json.weight ??= {})
    for (const id in json.weight) {
      json.weight[id] = util.math.clamp(json.weight[id])
      if (!(json.weight[id] > 0 && json.weight[id] <= 1))
        util.throw(`incorrect weight for ${id} (${json.weight[id]}) (${json.info.output})`)
      if (json.weight[id] === 1) {
        delete json.weight[id]
        continue
      }
      json.weight[id] = 1 - json.weight[id]
    }

    this.info = json.info
    this.weight = json.weight
  }

  /**
   * @param {AsyncInventory} inv 
   * @abstract
   */
  async craft(inv) {}

}

/** @typedef {BookRecipe | MacroRecipe} Recipe */

class BookRecipe extends BaseRecipe {

  /** @type {typeof RecipeType['Book']} */ type
  /** @type {RecipeId} */ id

  /**
   * @param {Crafting.json.BookRecipe} json 
   * @returns {BookRecipe}
   */
  static parse(json) {
    util.completeIdKey(json.info.input)
    json.info.output = util.completeId(json.info.output)
    json.id = util.completeId(json.id)
    return new BookRecipe(json)
  }

  /**
   * @param {Crafting.json.BookRecipe} json 
   */
  constructor(json) {
    super(json)
    this.type = RecipeType.Book
    this.id = json.id
  }

  /**
   * @param {AsyncInventory} inv 
   */
  async craft(inv) {
    for (let i = 0; i < 60; i++) {
      if (!Hud.isContainer() || !util.container.has(inv, this.info.input)) return
      if (Java.from(inv.getCraftableRecipes()).find(r => r.getId() === this.id)) break
      await util.waitTick()
      if (i >= 59) return
    }
    const output = Java.from(inv.getMap().output ?? inv.getMap().crafting_out)[0]
    outer:
    while (true) {
      /** @type {RecipeHelper=} */
      let recipe
      for (let i = 0; i < 200; i++) {
        recipe = undefined
        for (let i = 0; i < 5; i++) {
          if (!Hud.isContainer() || !util.container.has(inv, this.info.input)) return
          recipe = Java.from(inv.getCraftableRecipes()).find(r => r.getId() === this.id)
          if (recipe) break
          await util.waitTick()
        }
        if (!recipe) return
        if (!(i % 20)) {
          await inv.waitInterval()
          recipe.craft(true)
          await util.waitTick()
        }
        if (!inv.getSlot(output).isEmpty()) {
          await inv.quick(output)
          await inv.waitInterval()
          continue outer
        }
      }
      return
    }
  }

}

class MacroRecipe extends BaseRecipe {

  /** @type {typeof RecipeType['Macro']} */ type
  /** @type {Crafting.Pattern<ItemId>} */ pattern
  /** @type {Crafting.Pattern<number>} */ fullStackPattern
  /** @type {Dict<ItemId>} */ fullStackInput
  /** @type {Crafting.Pattern<ItemId>} */ collapsedPattern
  /** @type {{ from: number, to: number }[]} */ collapsedPatternMap

  /**
   * @param {Crafting.json.MacroRecipe} json 
   * @returns {MacroRecipe}
   */
  static parse(json) {
    util.throw('not fully implemented')
    util.completeIdKey(json.info.input)
    json.info.output = util.completeId(json.info.output)
    util.completeIdKey(json.pattern)
    
    if (json.pattern.length !== 9) util.throw(`pattern length is not 9 (${pattern.join(', ')})`)
    /** @type {Crafting.Pattern<number>} */
    const fullStackPattern = json.pattern.map(id => util.getMaxCount(id))
    const fullStackInput = util.dict.clone(json.info.input)
    for (const k in fullStackInput) fullStackInput[k] *= util.getMaxCount(k)
    const collapsedPattern = json.pattern.slice()
    /** @type {{ from: number, to: number }[]} */
    const collapsedPatternMap = []
    while (true) { // collapse the pattern
      const air  = collapsedPattern.indexOf(airId)
      if (air === -1) break
      const item = 8 - collapsedPattern.slice().reverse()
        .findIndex(id => id !== airId)
      if (item === 9) util.throw(`empty recipe pattern`)
      if (item < air) break
      collapsedPatternMap.push({
        from: air,
        to: item
      })
      collapsedPattern[air] = collapsedPattern[item]
      collapsedPattern[item] = airId
    }

    return new MacroRecipe(
      json,
      fullStackPattern,
      fullStackInput,
      collapsedPattern,
      collapsedPatternMap
    )
  }

  /**
   * @param {Crafting.json.MacroRecipe} json 
   * @param {number[]} fullStackPattern 
   * @param {Dict<ItemId, number>} fullStackInput 
   * @param {ItemId[]} collapsedPattern 
   * @param {{ from: number, to: number }[]} collapsedPatternMap 
   */
  constructor (
    json,
    fullStackPattern,
    fullStackInput,
    collapsedPattern,
    collapsedPatternMap
  ) {
    super(json)
    this.type = RecipeType.Macro
    this.pattern = json.pattern
    this.fullStackPattern = fullStackPattern
    this.fullStackInput = fullStackInput
    this.collapsedPattern = collapsedPattern
    this.collapsedPatternMap = collapsedPatternMap
  }

  /**
   * @param {AsyncInventory} inv 
   */
  async craft(inv) {
    if (!Hud.isContainer() || !util.container.has(inv, this.info.input)) return
    const input  = Java.from(inv.getMap().input  ?? inv.getMap().crafting_in)
    const output = Java.from(inv.getMap().output ?? inv.getMap().crafting_out)[0]
    while (util.container.has(inv, this.fullStackInput)) {
      outer:
      for (let s = 0; s < 9; s++) { // make crafting grid looks like collapsedPattern
        for (let tries = 0; tries < 20; tries++) {
          const item = inv.getSlot(input[s])
          if (item.getItemId() === this.collapsedPattern[s]
          && (this.collapsedPattern[s] === airId
          ||  item.getCount() >= this.fullStackPattern[s])) continue outer
          if (tries) await util.waitTick()
          if (item.getItemId() !== this.collapsedPattern[s]) {
            await inv.quick(input[s])
            if (!inv.getSlot(s).isEmpty()) util.throw(`can't take item back (${s})`)
            if (this.collapsedPattern[s] === airId) continue
          }
          const slots = util.container.getInventorySlots(inv).reverse()
          const slot = slots.find(i => {
            const item = inv.getSlot(i)
            return item.getItemId() === this.collapsedPattern[s]
            && item.getCount() === item.getMaxCount()
          }) ?? slots.find(i => inv.getSlot(i).getItemId() === this.collapsedPattern[s])
          if (slot === undefined) return Chat.log('a')
          await inv.quick(slot)
        }
      }
      
      // uncollapse and take result
      let hslot = inv.getMap().hotbar.find(s => inv.getSlot(s).isEmpty())
      ?? inv.getMap().hotbar.find(s => !inv.getSlot(s).isDamageable())
      ?? 7
      let putBackNeeded = !inv.getSlot(hslot).isEmpty()
      let slot
      for (const s of this.collapsedPatternMap) {
        await inv.swapHotbar(s.from, hslot)
        await inv.swapHotbar(s.to, hslot)
        slot ??= s.from
      }
      if (putBackNeeded) await inv.swapHotbar(slot, hslot)
      if (!(await util.container.assert(inv, output, this.info.output))) continue
      await inv.quick(output)
    }
    while (util.container.has(inv, this.info.input)) {
      let count = 0
      for (const id in this.info.input) {
        const c = util.container.countItemInInventory(inv, id)
        if (c > count) count = c
      }
      //
      util.throw('todo')
    }
  }

}

module.exports = new CraftingHandler
