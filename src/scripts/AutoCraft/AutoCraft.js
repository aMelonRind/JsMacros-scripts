
// WIP auto crafting script
// currently only support placed chests and recipe book

require('lib/DuplicateCheck')

const util = require('lib/util')
util.scriptName = 'AutoCraft'
util.debug.log = msg => util.log('[debug] ' + msg)
util.run(main)

async function main() {
  util.log('start')
  listeners()
  const instance = require('./instances/anvil.json')
  util.container.humanLike = instance.humanlike
  util.container.interval  = instance.interval
  util.storage.skipTop     = instance.skipTop
  util.movement.setArea(instance.walkingArea)
  util.storage.create({input:
    instance.materialFrom.map(v => v.box)
  })
  /** @type {Record<string, number[][][]>} */
  const outputBoxes = {}
  instance.productTo.forEach(v => {
    const id = util.completeId(v.for)
    outputBoxes[id] ??= []
    outputBoxes[id].push(v.box) // Object is possibly 'undefined'.ts(2532)
  })
  util.storage.create(outputBoxes)
  await util.storage.scan('input')
  /** @type {Record<string, string>} */
  const outputs = {}
  for (const k in outputBoxes) {
    outputs[k] = k
    await util.storage.scan(k)
  }
  util.crafting.loadRecipes(
    instance.recipe,
    Object.keys(outputs)
  )
  await util.crafting.exec('input', outputs,
    // @ts-ignore
    instance.craftingTables.map(v => util.Pos(...v)),
    // @ts-ignore
    util.Pos(...instance.invDump))
  util.glfw.requestAttention()
  if (Hud.isContainer()) Player.openInventory().close()
  util.log('end')
}

function listeners() {
  /** @type {(reason?: string) => (() => never)} */
  const stop = reason => () => {
    util.glfw.requestAttention()
    util.log(`stopped${reason ? ` (${reason})` : ''}`)
    return util.stopAll()
  }
  /** @type {(keyof Events)[]} */
  const stoppingEvents = ['DimensionChange', 'Death', 'Disconnect', 'JoinServer']
  stoppingEvents.forEach(e => util.on(e, stop(e)))
  util.waitForEvent('Key',
    e => e.key === 'key.keyboard.escape',
    stop('Escape')
  )
}

module.exports = {}
