
// WIP auto crafting script
// currently only support placed chests and recipe book

require('../lib/DuplicateCheck')

const util = require('../lib/util')
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
  const outputs = {}
  instance.productTo.forEach(v => {
    const id = util.completeId(v.for)
    outputs[id] ??= []
    outputs[id].push(v.box)
  })
  util.storage.create(outputs)
  await util.storage.scan('input')
  for (const k in outputs) {
    outputs[k] = k
    await util.storage.scan(k)
  }
  util.crafting.loadRecipes(
    instance.recipe.filter(r => r.on === 'crafting_table'),
    Object.keys(outputs)
  )
  await util.crafting.exec('input', outputs,
    instance.craftingTables.map(v => util.Pos(...v)),
    util.Pos(...instance.invDump))
  util.glfw.requestAttention()
  if (Hud.isContainer()) Player.openInventory().close()
  util.log('end')
}

function listeners() {
  const stop = extra => util.toJava(() => {
    util.glfw.requestAttention()
    util.log(`stopped${extra ? ` (${extra})` : ''}`)
    util.stopAll()
  })
  util.listeners.push(...['DimensionChange', 'Death', 'Disconnect', 'JoinServer']
    .map(l => JsMacros.on(l, stop(l))),
    JsMacros.on('Key', util.toJava(e => {
      if (e.key === 'key.keyboard.escape') stop('Escape')(null)
    }))
  )
}
